// 使用{uniqueIdentifier}模板，稍后我们将使用hexo的事件机制，替换成ISO时间，作为每次构建的唯一标识符
var cacheStorageKey = '17lai-cache-20230221163553';
// 在这个数组里面写入您主页加载需要的资源文件
var cacheList = [
  '/css/matery.css',
  '/css/my.css',
  '/css/post.css',
  '/css/reward.css',
  '/css/waline.css',
  '/css/highlight.css',
  '/css/highlight-dark.css',

  '/libs/jquery/jquery.min.js',
  '/libs/jquery/jquery-ui.min.css',
  '/libs/jquery/jquery-ui.min.js',
  '/libs/materialize/materialize.min.js',
  '/libs/materialize/materialize.min.css',
  '/libs/waline/waline.min.js',
  '/libs/waline/waline.min.css',
  '/libs/waline/comment.min.mjs',
  '/libs/waline/pageview.min.mjs',
  '/libs/waline/waline-count.js',

  '/js/color-schema.js',
  '/js/plugins.js',
  '/js/tw_cn.js',
  '/js/boot.js',
  '/js/utils.js',
  '/js/events.js'
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

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(cacheStorageKey)
      .then(cache => cache.match(event.request, {ignoreSearch: true}))
      .then(response => {
        // 使用缓存而不是进行网络请求，实现app秒开
        return response || fetch(event.request);
      })
  );
});
