// 使用{uniqueIdentifier}模板，稍后我们将使用hexo的事件机制，替换成ISO时间，作为每次构建的唯一标识符
var cacheStorageKey = '17lai-cache-20240412081756';
localStorage.setItem('cacheStorageKey', cacheStorageKey);

// 在这个数组里面写入您主页加载需要的资源文件
var cacheList = [
  '/css/matery.css?v=1.0.16',
  '/css/my.css?v=1.0.1',
  '/css/highlight.css?v=1.0.0',
  '/css/highlight-dark.css?v=1.0.0',

  '/libs/jquery/jquery.min.js',
  '/libs/materialize/materialize.min.js?v=1.2.2',
  '/libs/materialize/materialize.min.css?v=1.2.2',
  '/libs/masonry/masonry.pkgd.min.js',
  '/libs/aos/aos.min.css',
  '/libs/aos/aos.min.js',
  '/libs/waline/waline-count.js',

  '/js/umami.js?v=1.0.3',
  '/js/color-schema.js?v=1.0.0',
  '/js/plugins.js?v=1.0.0',
  '/js/tw_cn.js?v=1.0.0',
  '/js/boot.js?v=1.0.0',
  '/js/utils.js?v=1.0.5',
  '/js/events.js?v=1.0.0'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheStorageKey)
      .then(cache => cache.addAll(cacheList))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheStorageKey) {
          // 清理旧版本
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  // 更新客户端
  return self.clients.claim();
});

const proxyMap = {
  'https://cdn.jsdelivr.net': 'https://fastly.jsdelivr.net',
  'https://unpkg.com/@waline/emojis': 'https://cdn.jsdelivr.net/npm/@waline/emojis',
  'https://cimg1.17lai.site': 'https://cimg1.17lai.fun',
  'https://cdn.17lai.fun': 'https://cdn.17lai.site',
  'https://cdn.webpushr.com': 'https://cdn-push.17lai.site',
  'https://bot.webpushr.com': 'https://bot-push.17lai.site',
  'https://analytics.webpushr.com': 'https://analytics-push.17lai.site',
  'https://notevents.webpushr.com': 'https://notevents-push.17lai.site'
};

function isProxyRequired(url) {
  const requestUrl = new URL(url);
  for (const [origin, proxyUrl] of Object.entries(proxyMap)) {
    const proxyOrigin = new URL(origin);
    if (requestUrl.origin === proxyOrigin.origin && requestUrl.pathname.startsWith(proxyOrigin.pathname)) {
      console.log('[PWA]Proxy required for URL:', url);
      console.log('[PWA]Matched origin:', origin);
      return proxyUrl;
    }
  }
  console.log('[PWA]Proxy not required for URL:', url);
  return null;
}

function getMirrorRequired(url) {
  const requestUrl = new URL(url);
  for (const [origin, proxyUrl] of Object.entries(proxyMap)) {
    const proxyOrigin = new URL(origin);
    if (requestUrl.origin === proxyOrigin.origin && requestUrl.pathname.startsWith(proxyOrigin.pathname)) {
      const replacedUrl = url.replace(origin, proxyUrl);
      console.log('[PWA]Proxy required for URL:', url);
      console.log('[PWA]Replaced URL:', replacedUrl);
      return replacedUrl;
    }
  }
  console.log('[PWA]Proxy not required for URL:', url);
  return url;
}

async function checkWebPushrConnection(timeout) {
  try {
    const controller = new AbortController();
    const { signal } = controller;
    const response = await fetch('https://webpushr.com', { signal, timeout });
    return response.ok;
  } catch (error) {
    console.error('[PWA]Failed to connect to webpushr.com:', error);
    return false;
  }
}

self.addEventListener('fetch', async event => {
  const requestUrl = new URL(event.request.url);

  // 处理 PWA 缓存逻辑
  event.respondWith(
    caches.open(cacheStorageKey)
      .then(cache => cache.match(event.request, { ignoreSearch: true }))
      .then(response => {
        if (response) {
          return response;
        } else {
          // 如果缓存中没有找到资源，尝试原始请求
          return fetch(event.request)
            .then(originalResponse => {
              if (!originalResponse.ok) {
                // 如果原始请求失败，在 catch 中处理
                throw new Error('Original request failed');
              } else {
                // 如果原始请求成功，直接返回原始请求的响应
                return originalResponse;
              }
            });
        }
      })
      .catch(error => {
        console.error('[PWA]Fetch failed, serving online response:', error);

        // 如果原始请求失败，尝试使用代理请求
        const proxyUrl = isProxyRequired(event.request.url);
        if (proxyUrl) {
          console.log('[PWA] original request failed, using proxy:', proxyUrl);
          return handleProxyRequest(event.request, proxyUrl);
        } else {
          // 如果没有可用的代理，直接返回原始请求的响应
          console.log('[PWA] original request failed, no proxy available');
          return fetch(event.request);
        }
      })
  );
});

async function ProxyRequest(request, proxyUrl) {
  try {
    console.log('[PWA]Attempting proxy request to:', proxyUrl);

    const originalUrl = new URL(request.url);
    console.log('[PWA]Original URL:', originalUrl.href);

    const proxyResponse = await fetch(proxyUrl + request.url.replace(request.referrer, ''), request);
    console.log('[PWA]Proxy request:', proxyUrl + (request.url.startsWith(request.referrer) ? request.url.substring(request.referrer.length) : request.url));
    return proxyResponse;
  } catch (err) {
    console.error('[PWA]Error proxying request:', err);
    throw err;
  }
}
async function handleProxyRequest(request, proxyUrl) {
  try {
    console.log('[PWA]Attempting proxy request to:', proxyUrl);

    const originalUrl = new URL(request.url);
    const proxyRequestUrl = getMirrorRequired(originalUrl.href);

    console.log('[PWA]Original URL:', originalUrl.href);
    console.log('[PWA]Proxy URL:', proxyRequestUrl);

    const proxyResponse = await fetch(proxyRequestUrl, request);
    console.log('[PWA]Proxy request:', proxyRequestUrl);

    return proxyResponse;
  } catch (err) {
    console.error('[PWA]Error proxying request:', err);
    throw err;
  }
}
