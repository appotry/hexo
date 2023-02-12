// 使用{uniqueIdentifier}模板，稍后我们将使用hexo的事件机制，替换成ISO时间，作为每次构建的唯一标识符
var cacheStorageKey = '17lai-cache-20230212163650';
// 在这个数组里面写入您主页加载需要的资源文件
var cacheList = [
  '{cdnUrl}/css/matery.css',
  '{cdnUrl}/css/my.css',
  '{cdnUrl}/css/post.css',
  '{cdnUrl}/css/reward.css',
  '{cdnUrl}/css/waline.css',
  '/css/highlight.css',
  '/css/highlight-dark.css',

  '{cdnUrl}/js/color-schema.js',
  '{cdnUrl}/js/plugins.js',
  '{cdnUrl}/js/tw_cn.js',
  '{cdnUrl}/js/boot.js',
  '{cdnUrl}/js/utils.js',
  '{cdnUrl}/js/events.js'
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
