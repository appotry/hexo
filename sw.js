// 使用2022-03-21T13:03:49.776Z模板，稍后我们将使用hexo的事件机制，替换成ISO时间，作为每次构建的唯一标识符
var cacheName = 'tellyouwhat-cache-{uniqueIdentifier}';
// 在这个数组里面写入您主页加载需要的资源文件
var filesToCache = [
  '/',
  '/categories/',
  '/tags/',
  '/archives/',
  '/about/',
  '/js/matery.js',
  '/js/search.js',
  '/css/matery.css',
  '/css/my.css',
  '/css/my-gitalk.css',
  '/page/2/',
  '/favicon.png',
  '/medias_webp/hongmiaosi.webp',
  '/medias_webp/background.webp',
  '/medias_webp/icons/android-chrome-192x192.png',
  '/medias_webp/icons/android-chrome-512x512.png',
  '/manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(filesToCache)
        .then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
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
    caches.open(cacheName)
      .then(cache => cache.match(event.request, {ignoreSearch: true}))
      .then(response => {
        // 使用缓存而不是进行网络请求，实现app秒开
        return response || fetch(event.request);
      })
  );
});