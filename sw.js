// 使用{uniqueIdentifier}模板，稍后我们将使用hexo的事件机制，替换成ISO时间，作为每次构建的唯一标识符
var cacheStorageKey = '17lai-cache-20230218230516';
// 在这个数组里面写入您主页加载需要的资源文件
var cacheList = [
  'https://fast.17lai.site/css/matery.css',
  'https://fast.17lai.site/css/my.css',
  'https://fast.17lai.site/css/post.css',
  'https://fast.17lai.site/css/reward.css',
  'https://fast.17lai.site/css/waline.css',
  '/css/highlight.css',
  '/css/highlight-dark.css',

  'https://fast.17lai.site/libs/jquery/jquery.min.js',
  'https://fast.17lai.site/libs/jquery/jquery-ui.min.css',
  'https://fast.17lai.site/libs/jquery/jquery-ui.min.js',
  'https://fast.17lai.site/libs/materialize/materialize.min.js',
  'https://fast.17lai.site/libs/materialize/materialize.min.css',
  'https://fast.17lai.site/libs/waline/waline.min.js',
  'https://fast.17lai.site/libs/waline/waline.min.css',
  'https://fast.17lai.site/libs/waline/comment.min.mjs',
  'https://fast.17lai.site/libs/waline/pageview.min.mjs',
  'https://fast.17lai.site/libs/waline/waline-count.js',

  'https://fast.17lai.site/js/color-schema.js',
  'https://fast.17lai.site/js/plugins.js',
  'https://fast.17lai.site/js/tw_cn.js',
  'https://fast.17lai.site/js/boot.js',
  'https://fast.17lai.site/js/utils.js',
  'https://fast.17lai.site/js/events.js'
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
