// 使用{uniqueIdentifier}模板，稍后我们将使用hexo的事件机制，替换成ISO时间，作为每次构建的唯一标识符
var cacheStorageKey = '17lai-cache-20240411182754';
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
  '/js/utils.js?v=1.0.2',
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
  'https://cdn.17lai.fun/': 'https://cdn.17lai.site/',
  'https://cdn.webpushr.com/': 'https://cdn-push.17lai.site/',
  'https://bot.webpushr.com/': 'https://bot-push.17lai.site/',
  'https://analytics.webpushr.com/': 'https://analytics-push.17lai.site/',
  'https://notevents.webpushr.com/': 'https://notevents-push.17lai.site/'
};

function isProxyRequired(url) {
  const requestUrl = new URL(url);
  for (const [origin, proxyUrl] of Object.entries(proxyMap)) {
    if (requestUrl.origin.endsWith(new URL(origin).hostname)) {
      return proxyUrl;
    }
  }
  return null;
}

async function checkWebPushrConnection(timeout) {
  try {
    const controller = new AbortController();
    const { signal } = controller;
    const response = await fetch('https://webpushr.com', { signal, timeout });
    return response.ok;
  } catch (error) {
    console.error('Failed to connect to webpushr.com:', error);
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
                // 如果原始请求失败，尝试使用代理请求
                const proxyUrl = isProxyRequired(event.request.url);
                if (proxyUrl) {
                  return handleProxyrRequest(event.request, proxyUrl);
                } else {
                  // 如果没有可用的代理，直接返回原始请求的响应
                  return originalResponse;
                }
              } else {
                // 如果原始请求成功，直接返回原始请求的响应
                return originalResponse;
              }
            });
        }
      })
      .catch(error => {
        console.error('Fetch failed, serving online response:', error);
        return fetch(event.request);
      })
  );
});

async function handleProxyrRequest(request, proxyUrl) {
  try {
    const proxyResponse = await fetch(proxyUrl + request.url.replace(request.referrer, ''), request);
    return proxyResponse;
  } catch (err) {
    console.error('Error proxying request:', err);
    throw err;
  }
}
