// 使用{uniqueIdentifier}模板，稍后我们将使用hexo的事件机制，替换成ISO时间，作为每次构建的唯一标识符
var cacheStorageKey = '17lai-cache-20220808145527';
// 在这个数组里面写入您主页加载需要的资源文件
var cacheList = [
  '/css/matery.css',
  '/css/my.css',
  '/css/post.css',
  '/css/indexcover.css',
  '/css/dark.css',

  '/libs/awesome/css/all.min.css',
  '/libs/materialize/materialize.min.css',
  '/libs/aos/aos.css',
  '/libs/animate/animate.min.css',
  '/libs/lightGallery/css/lightgallery.min.css',

  '/libs/awesome/webfonts/fa-brands-400.woff2',
  '/libs/awesome/webfonts/fa-regular-400.woff2',
  '/libs/awesome/webfonts/fa-solid-900.woff2',

  '/manifest.json',

  '/js/matery.js',
  '/js/search.js',
  '/js/jquery.barrager.js',
  '/libs/anime/anime.min.js',
  
  '/libs/aos/aos.js',
  '/libs/scrollprogress/scrollProgress.min.js',
  '/libs/others/busuanzi.pure.mini.js',
  '/libs/jqcloud/jqcloud-1.0.4.min.js',
  "/libs/jquery/jquery-3.6.0.min.js",
  "/libs/materialize/materialize.js",
  "/libs/masonry/masonry.pkgd.min.js",
  '/libs/typed/typed.js',
  '/libs/others/buble.js',
  '/libs/instantpage/instantpage.js',

  '/libs/waline/waline-count.js',
  '/libs/waline/waline.min.js',
  
  '/libs/live2d/waifu.css',
  '/libs/live2d/waifu-tips.json',
  "/libs/jquery/jquery-ui.min.js",
  "/libs/jquery/jquery-ui.min.css",

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
