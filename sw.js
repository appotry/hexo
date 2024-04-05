// 使用{uniqueIdentifier}模板，稍后我们将使用hexo的事件机制，替换成ISO时间，作为每次构建的唯一标识符
var cacheStorageKey = '17lai-cache-20240406012759';
// 在这个数组里面写入您主页加载需要的资源文件
var cacheList = [
  '/css/matery.css?v=1.0.12',
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

  '/js/umami.js?v=1.0.2',
  '/js/color-schema.js?v=1.0.0',
  '/js/plugins.js?v=1.0.0',
  '/js/tw_cn.js?v=1.0.0',
  '/js/boot.js?v=1.0.0',
  '/js/utils.js?v=1.0.1',
  '/js/events.js?v=1.0.0'
];

// self.addEventListener('install', e => {
//   e.waitUntil(
//     caches.open(cacheStorageKey).then(cache => {
//       return cache.addAll(cacheList)
//         .then(() => self.skipWaiting());
//     })
//   );
// });

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

// self.addEventListener('fetch', event => {
//   event.respondWith(
//     caches.open(cacheStorageKey)
//       .then(cache => cache.match(event.request, {ignoreSearch: true}))
//       .then(response => {
//         // 使用缓存而不是进行网络请求，实现app秒开
//         return response || fetch(event.request);
//       })
//       .catch(error => {
//         // console.error('Fetch error:', error);
//         // throw error;
//         console.error('Fetch failed, serving online response:', error);
//         return fetch(event.request);
//       })
//   );
// });

self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);
  const proxyMap = {
    'https://cdn.webpushr.com/': 'https://cdn-push.17lai.site/',
    'https://bot.webpushr.com/': 'https://bot-push.17lai.site/',
    'https://analytics.webpushr.com/': 'https://analytics-push.17lai.site/',
    'https://notevents.webpushr.com/': 'https://notevents-push.17lai.site/'
  };

  // 检查是否需要代理请求
  const proxyUrl = proxyMap[requestUrl.origin];
  if (proxyUrl) {
    event.respondWith(handleWebPushrRequest(event.request, proxyUrl));
    return;
  }

  // 处理 PWA 缓存逻辑
  event.respondWith(
    caches.open(cacheStorageKey)
      .then(cache => cache.match(event.request, { ignoreSearch: true }))
      .then(response => {
        return response || fetch(event.request).catch(() => {
          // 如果网络请求失败,尝试代理请求
          const proxyUrl = proxyMap[requestUrl.origin];
          if (proxyUrl) {
            return handleWebPushrRequest(event.request, proxyUrl);
          }
          return new Response('Network request failed', { status: 408 });
        });
      })
      .catch(error => {
        console.error('Fetch failed, serving online response:', error);
        // 如果缓存请求失败,尝试代理请求
        const proxyUrl = proxyMap[requestUrl.origin];
        if (proxyUrl) {
          return handleWebPushrRequest(event.request, proxyUrl);
        }
        // 否则,尝试从网络获取资源
        return fetch(event.request);
      })
  );
});

async function handleWebPushrRequest(request, proxyUrl) {
  try {
    const proxyResponse = await fetch(proxyUrl + request.url.replace(request.referrer, ''), request);
    return proxyResponse;
  } catch (err) {
    console.error('Error proxying request:', err);
    return new Response('Error proxying request', { status: 500 });
  }
}
