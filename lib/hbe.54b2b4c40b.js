'use strict';

/**
 * 主题内置加密 — 前端解密（2026-08-09 自研，借鉴 HBE v4 src/browser/）
 * WebCrypto：PBKDF2-SHA256(250k) → AES-256-GCM 解密
 * - GCM 认证失败 = 密码错误（单一失败模式）
 * - autoSave：存派生 key（非密码）到 localStorage（默认关）
 * - 解密完成派发 CustomEvent('hexo-blog-decrypt', {detail:{mode}})
 * 与 scripts/encrypt/crypto.js 服务端配套，参数必须一致
 */

(function () {
  'use strict';

  const KEY_BITS = 256;
  const TAG_BITS = 128;
  const TAG_BYTES = 16;
  const STORAGE_PREFIX = 'hbe.v4.';
  // autoSave 存储有效期（毫秒）：1 天（用户期望 2026-08-10 设计）
  // 到期后自动清除，需重新输密；旧存储（无 expiresAt）视为过期
  const TTL_DEFAULT = 86400000;
  const SCHEMA_VERSION = 4;
  const FORMAT_VERSION = '4';
  const TEXT_DECODER = new TextDecoder('utf-8', { fatal: true });
  const TEXT_ENCODER = new TextEncoder();

  function hexToBytes(hex) {
    if (hex.length % 2 !== 0) throw new Error('hex string has odd length');
    const out = new Uint8Array(hex.length / 2);
    for (let i = 0; i < out.length; i++) {
      out[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return out;
  }

  async function deriveKey(password, salt, iterations) {
    const baseKey = await crypto.subtle.importKey(
      'raw', TEXT_ENCODER.encode(password), { name: 'PBKDF2' }, false, ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
      baseKey,
      { name: 'AES-GCM', length: KEY_BITS },
      true, // extractable=true → autoSave 可持久化派生 key
      ['decrypt']
    );
  }

  async function decryptWithKey(key, nonce, ciphertextWithTag) {
    const plainBuf = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: nonce, tagLength: TAG_BITS }, key, ciphertextWithTag
    );
    return TEXT_DECODER.decode(plainBuf);
  }

  async function tryDecryptWithPassword({ password, saltHex, nonceHex, ciphertextHex, iterations }) {
    try {
      const salt = hexToBytes(saltHex);
      const nonce = hexToBytes(nonceHex);
      const ciphertext = hexToBytes(ciphertextHex);
      if (ciphertext.length < TAG_BYTES) return { ok: false };
      const key = await deriveKey(password, salt, iterations);
      const plaintext = await decryptWithKey(key, nonce, ciphertext);
      return { ok: true, plaintext, key };
    } catch (_e) {
      return { ok: false };
    }
  }

  async function tryDecryptWithKey({ key, nonceHex, ciphertextHex }) {
    try {
      const nonce = hexToBytes(nonceHex);
      const ciphertext = hexToBytes(ciphertextHex);
      if (ciphertext.length < TAG_BYTES) return { ok: false };
      const plaintext = await decryptWithKey(key, nonce, ciphertext);
      return { ok: true, plaintext };
    } catch (_e) {
      return { ok: false };
    }
  }

  // ---- storage（autoSave）----
  function bytesToB64(bytes) {
    let s = '';
    for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s);
  }

  function b64ToBytes(b64) {
    const s = atob(b64);
    const out = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
    return out;
  }

  function pageKey() { return location.pathname + location.search; }

  async function saveDerivedKey(pageKey, key, saltHex, nonceHex) {
    try {
      const raw = await crypto.subtle.exportKey('raw', key);
      const data = {
        version: SCHEMA_VERSION, dk: bytesToB64(new Uint8Array(raw)),
        salt: saltHex, nonce: nonceHex, expiresAt: Date.now() + TTL_DEFAULT,
      };
      localStorage.setItem(STORAGE_PREFIX + pageKey, JSON.stringify(data));
    } catch (_e) { /* autoSave 失败静默 */ }
  }

  async function loadDerivedKey(pageKey, expectedSaltHex) {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + pageKey);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || data.version !== SCHEMA_VERSION || typeof data.dk !== 'string'
          || typeof data.salt !== 'string' || typeof data.nonce !== 'string'
          || typeof data.expiresAt !== 'number' || data.expiresAt <= Date.now()) {
        localStorage.removeItem(STORAGE_PREFIX + pageKey);
        return null;
      }
      if (data.salt !== expectedSaltHex) {
        localStorage.removeItem(STORAGE_PREFIX + pageKey);
        return null;
      }
      const keyBytes = b64ToBytes(data.dk);
      return await crypto.subtle.importKey('raw', keyBytes, { name: 'AES-GCM' }, true, ['decrypt']);
    } catch (_e) {
      try { localStorage.removeItem(STORAGE_PREFIX + pageKey); } catch (_e2) { /* ignore */ }
      return null;
    }
  }

  // ---- wire 格式读取 ----
  function readWireFormat(el) {
    const d = el.dataset;
    const dataEl = el.querySelector('script#hbeData');
    return {
      format: d.hbeFormat,
      wpm: d.wpm || '密码错误，请重试',
      saltHex: d.salt,
      nonceHex: d.nonce,
      iterations: parseInt(d.kdfIterations, 10) || 250000,
      autoSave: d.autoSave === 'true',
      storageKey: d.storageKey || '',     // 自定义 localStorage 键（segment/wiki），空则用 pageKey()
      ciphertextHex: dataEl ? dataEl.textContent.trim() : '',
    };
  }

  function dispatchDecryptEvent(mode) {
    try {
      window.dispatchEvent(new CustomEvent('hexo-blog-decrypt', { detail: { mode } }));
    } catch (_e) {
      try { window.dispatchEvent(new Event('hexo-blog-decrypt')); } catch (_e2) { /* ignore */ }
    }
  }

  // ---- UI ----
  function swapInDecryptedDOM(container, plaintext) {
    const holder = document.createElement('div');
    holder.innerHTML = plaintext;
    // 执行解密内容中的 script（复制节点重新执行）
    // 2026-09-09 bug 修复：跳过 data-pjax 的 hbe-bundle 自身——解密内容含 assetTags 注入的
    // hbe script，重执行会二次 init → 对已 decrypted 容器误报"格式不兼容"（幂等保护兜底 + 此处预防）。
    const scripts = holder.querySelectorAll('script:not([data-pjax])');
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      for (const attr of oldScript.attributes) newScript.setAttribute(attr.name, attr.value);
      newScript.text = oldScript.text;
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
    holder.id = 'hexo-blog-encrypt';
    holder.classList.add('hbe', 'hbe-decrypted-content');
    container.parentNode.replaceChild(holder, container);
    // 事件由 onSuccess 统一派发（manual/cached 各一次，避免 swapIn 重复派发导致监听器触发两次）
  }

  function showError(el, msg) {
    let alert = el.querySelector('[role="alert"]');
    if (!alert) {
      alert = document.createElement('div');
      alert.setAttribute('role', 'alert');
      alert.className = 'hbe hbe-error';
      el.appendChild(alert);
    }
    alert.textContent = msg;
  }

  function clearError(el) {
    const alert = el.querySelector('[role="alert"]');
    if (alert) alert.textContent = '';
  }

  function readPassword(el) {
    const input = el.querySelector('#hbePass');
    return input ? input.value : '';
  }

  // ---- 主流程 ----
  async function handleSubmit(container, wire, form, onSuccess) {
    clearError(container);
    const password = readPassword(form);
    if (!password) {
      showError(container, wire.wpm);
      return;
    }
    const result = await tryDecryptWithPassword({
      password,
      saltHex: wire.saltHex,
      nonceHex: wire.nonceHex,
      ciphertextHex: wire.ciphertextHex,
      iterations: wire.iterations,
    });
    if (!result.ok) {
      showError(container, wire.wpm);
      return;
    }
    if (wire.autoSave) {
      await saveDerivedKey(wire.storageKey || pageKey(), result.key, wire.saltHex, wire.nonceHex);
    }
    onSuccess(result.plaintext);
  }

  async function tryCached(container, wire, onSuccess) {
    if (!wire.autoSave) return false;
    const key = wire.storageKey || pageKey();
    const k = await loadDerivedKey(key, wire.saltHex);
    if (!k) return false;
    const result = await tryDecryptWithKey({
      key: k,
      nonceHex: wire.nonceHex,
      ciphertextHex: wire.ciphertextHex,
    });
    if (!result.ok) {
      try { localStorage.removeItem(STORAGE_PREFIX + key); } catch (_e) { /* ignore */ }
      return false;
    }
    onSuccess(result.plaintext, 'cached');
    return true;
  }

  function init() {
    // 遍历所有加密容器（文章整体 / 相册 / 内容片段可同页共存，2026-09-07）
    const containers = document.querySelectorAll('#hexo-blog-encrypt');
    if (!containers.length) return;
    containers.forEach((container) => {
      // 幂等保护（2026-09-09 bug 修复）：解密内容重执行 script 会再次触发 init，
      // 已 decrypted/error 的容器无 data 属性 → 误报"格式不兼容"。跳过已处理容器。
      if (container.classList.contains('hbe-decrypted-content') || container.classList.contains('hbe-error')) return;
      const wire = readWireFormat(container);
      if (wire.format !== FORMAT_VERSION) {
        showError(container, '加密格式版本不兼容，请刷新页面重试');
        return;
      }

      let done = false;
      const onSuccess = (plaintext, mode) => {
        if (done) return;
        done = true;
        swapInDecryptedDOM(container, plaintext);
        // 解密完成事件（manual 手动输入 / cached 缓存恢复），监听者（如相册 initGallery）据此初始化
        dispatchDecryptEvent(mode || 'manual');
        // 2026-09-09 bug 修复：解密后内容出现新的 .code-area/.mermaid/图片 等，需完整刷新——
        //   codeWidget（代码工具栏）+ articleInit（图片灯箱，post/wiki 共用）+ 
        //   events.refresh（mermaid/progressBar/TOC refresh 回调）+ refreshLayout（AOS/Masonry 布局）。
        //   boot.refresh 只含 codeWidget+refreshLayout，不含 events.refresh（mermaid）与
        //   articleInit（灯箱），故四者都触发。articleInit 幂等（destroy 旧实例重建）。
        //   防御引用（bundle 独立加载，主题刷新失败不中断解密）。
        try {
          if (typeof Matery !== 'undefined') {
            if (Matery.boot && typeof Matery.boot.refresh === 'function') {
              Matery.boot.refresh(); // codeWidget + refreshLayout
            }
            if (typeof Matery.articleInit === 'function') {
              Matery.articleInit(); // 图片灯箱（post/wiki 统一）
            }
            if (Matery.events && typeof Matery.events.refresh === 'function') {
              Matery.events.refresh(); // mermaid/progressBar/TOC refresh 回调
            }
          }
        } catch (_e) { /* ignore：独立 bundle 不应因主题刷新失败而中断解密 */ }
      };

      const form = container.querySelector('#hbeForm');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          handleSubmit(container, wire, form, onSuccess);
        });
      }

      // autoSave 快速路径（异步，不阻塞表单）
      tryCached(container, wire, onSuccess).then((used) => {
        if (!used && !done) {
          const passInput = container.querySelector('#hbePass');
          if (passInput) passInput.focus();
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
