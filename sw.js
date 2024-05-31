// 定义缓存版本号 使用{uniqueIdentifier}模板，稍后我们将使用hexo的事件机制，替换成ISO时间，作为每次构建的唯一标识符
const cacheStorageKeyPrefix = '17lai-cache-';
const cacheStorageKey = `17lai-cache-20240531192217`;

// 在这个数组里面写入您主页加载需要的资源文件
var cacheList = [
  '/css/matery.css?v=1.1.6',
  '/css/my.css?v=1.0.2',
  '/css/highlight.css?v=1.0.0',
  '/css/highlight-dark.css?v=1.0.0',
  '/libs/awesome/css/all.min.css?v=5.15.4',
  
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
  '/js/tw_cn.js?v=1.0.1',
  '/js/boot.js?v=1.0.0',
  '/js/utils.js?v=1.0.11',
  '/js/events.js?v=1.0.0'
];

// 在Service Worker安装时,将cacheList中的资源缓存到Service Worker缓存中
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheStorageKey)
      .then(cache => cache.addAll(cacheList))
      .then(() => self.skipWaiting())
  );
});
// 处理 skipWaiting 消息
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
    console.log('[PWA] rec message skipWaiting');
  }
});

// 监听 activate 事件
self.addEventListener('activate', event => {
  event.waitUntil(
    // 检查当前缓存的版本号是否与最新版本不同
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 只处理以特定前缀开头的缓存
          if (cacheName.startsWith(cacheStorageKeyPrefix)) {
            // 如果缓存名称不是当前版本号，即需要清理旧缓存
            if (cacheName !== cacheStorageKey) {
              console.log('[PWA] Removing old cache:', cacheName);
              return caches.delete(cacheName);
            }
          }
        })
      );
    })
    .then(() => {
      // 在清理旧缓存后，添加新的缓存资源
      console.log('[PWA] Found caching resources', cacheStorageKey);
      return caches.open(cacheStorageKey)
        .then(cache => {
          return cache.addAll(cacheList);
        });
    })
    .then(() => {
      // 完成缓存更新后，激活当前服务工作器
      console.log('[PWA] Activation complete');
      return self.clients.claim(); // 影响其他 service worker
    })
  );
});

// 在 Service Worker 中设置的标识符
const customIdentifier = '17laiIdentifier';
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'checkIdentifier') {
    // 发送带有标识符的消息给客户端
    event.source.postMessage({ identifier: customIdentifier });
  }
});

const proxyMap = new Map([
  ['https://cdn.jsdelivr.net', 'https://fastly.jsdelivr.net'],
  ['https://unpkg.com/@waline/emojis', 'https://fastly.jsdelivr.net/npm/@waline/emojis'],
  ['https://fastly.jsdelivr.net/npm/@waline/emojis', 'https://unpkg.com/@waline/emojis'],
  ['https://cdn.webpushr.com', 'https://cdn-push.17lai.site'],
  ['https://bot.webpushr.com', 'https://bot-push.17lai.site'],
  ['https://analytics.webpushr.com', 'https://analytics-push.17lai.site'],
  ['https://notevents.webpushr.com', 'https://notevents-push.17lai.site']
]);
// 判断是否需要代理
function isProxyRequired(url) {
  const requestUrl = new URL(url);
  for (const [origin, proxyUrl] of proxyMap.entries()) {
    const proxyOrigin = new URL(origin);

    if (requestUrl.origin === proxyOrigin.origin && requestUrl.pathname.startsWith(proxyOrigin.pathname)) {
      // console.log('[PWA] Proxy required for URL:', url, 'to:', proxyUrl);
      return proxyUrl;
    }
  }
  // console.log('[PWA]Proxy not required for URL:', url);
  return null;
}

// 代理目标地址的获取
function getMirrorRequired(url) {
  const requestUrl = new URL(url);
  for (const [origin, proxyUrl] of proxyMap.entries()) {
    const proxyOrigin = new URL(origin);
    if (requestUrl.origin === proxyOrigin.origin && requestUrl.pathname.startsWith(proxyOrigin.pathname)) {
      const replacedUrl = url.replace(origin, proxyUrl);
      // console.log('[PWA] Redirected from:', url);
      // console.log('[PWA] Redirected to:', replacedUrl);
      return replacedUrl;
    }
  }
  // console.log('[PWA] Proxy not required for URL:', url);
  return url;
}

function refreshCacheList(cacheStorageKey) {
  return caches.open(cacheStorageKey)
    .then(cache => {
      // 遍历缓存列表中的每个资源
      return Promise.all(cacheList.map(url => {
        // 尝试从缓存中获取资源
        return cache.match(url)
          .then(response => {
            if (!response) {
              // 如果缓存中没有找到资源，则从网络获取并放入缓存
              console.log('[PWA] Resource not found in cache, fetching from network:', url);
              return fetch(url, { cache: 'default' })
                .then(fetchResponse => {
                  if (fetchResponse.ok) {
                    // 如果网络请求成功，则将其放入缓存中
                    console.log('[PWA] Caching resource:', url);
                    cache.put(url, fetchResponse.clone());

                    // 返回响应对象
                    return fetchResponse;
                  } else {
                    // 如果网络请求失败,抛出错误
                    throw new Error(`Failed to fetch ${url}`);
                  }
                });
            } else {
              // 如果缓存中已经存在资源，则直接返回
              // console.log('[PWA] Resource found in cache:', url);
              return response;
            }
          });
      }));
    })
    .catch(error => {
      console.error('[PWA] Failed to refresh cache list:', error);
    });
}


/**
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
*/


/**
 * 
 * 同步代理实现
  // 拦截所有网络请求,进行缓存和代理处理
  self.addEventListener('fetch', (event) => {
    const enableProxy = isProxyRequired(event.request.url);
  
    if (enableProxy) {
      // 需要代理处理流程
      
      event.respondWith(
        caches.open(cacheStorageKey)
          .then(cache => cache.match(event.request, {ignoreSearch: true}))
          .then(response => {
            if (response) {
              // 如果缓存中存在该资源，则直接返回缓存的响应
              return response;
            } else {
  
              return fetchData(event.request.url)
                .then(response => {
                  if (response.ok) {
                    return response;
                  } else {
                    // 处理请求失败的情况
                    console.log('[PWA] proxy for:', event.request.url);
                    return fetchData(getMirrorRequired(event.request.url))
                      .then(response => {
                          console.log('[PWA] Response status:', response.status);
                          return response;
                      })
                      .catch(error => {
                        // 处理捕获的错误
                        console.error('[PWA] Error:', error);
                        return new Response('Request failed', { status: 500, statusText: 'Internal Server Error' });
                      });
                  }
                })
                .catch(error => {
                  // 原始url 请求异常的情况
                  console.log('[PWA] proxy for:', event.request.url);
                  return fetchData(getMirrorRequired(event.request.url))
                    .then(response => {
                        console.log('[PWA] Response status:', response.status);
                        return response;
                    })
                    .catch(error => {
                      // 处理捕获的错误
                      console.error('[PWA] Error:', error);
                      return new Response('Request failed', { status: 500, statusText: 'Internal Server Error' });
                    });
                });
            }
          })
      );
    } else {
      // 不需要代理处理流程
      event.respondWith(
        caches.open(cacheStorageKey)
          .then(cache => cache.match(event.request, {ignoreSearch: true}))
          .then(response => {
            // 使用缓存而不是进行网络请求，实现app秒开
            return response || fetch(event.request);
          })
      );
    }
  });
  
  async function fetchData(url) {
    try {
        // 发送 GET 请求，获取实际内容
        return await fetch(url);
        // const response = await fetch(url, { mode: 'no-cors' });
        // console.log('[PWA] Network response status:', response.status);
        // return response;
    } catch (error) {
        // 捕获异常，说明网络请求失败
        console.error('Network request failed:', error);
        throw error;
    }
  }
*/

/**
  下面为异步代理实现
*/

// async function fetchData(request) {
//   try {
//     // 尝试从缓存中匹配请求
//     const cacheResponse = await caches.match(request);
//     if (cacheResponse) {
//       // 如果在缓存中找到了对应的响应，则直接返回缓存的响应
//       console.log('[PWA] Cached response:', request.url);
//       return cacheResponse;
//     } else {
//       // 如果缓存中没有找到对应的响应，则发送网络请求
//       const networkResponse = await fetch(request);

//       // 如果网络请求成功，则将响应存储到缓存中
//       if (networkResponse.ok) {
//         const cache = await caches.open(cacheStorageKey);
//         cache.put(request, networkResponse.clone()); // 注意要 clone() 响应对象，因为 put() 方法会消耗掉该响应对象
//       }

//       // 返回网络响应
//       return networkResponse;
//     }
//   } catch (error) {
//     console.error('[PWA] Network request failed:', error);
//     throw error;
//   }
// }
async function fetchData(request) {
  // return await fetch(request);
  try {
    return await fetch(request);
  } catch (error) {
    // console.error('[PWA] Network request failed:', error);
    throw error;
  }
}

self.addEventListener('fetch', (event) => {
  if (isProxyRequired(event.request.url)) {
    // console.log('[PWA] proxy for:', request.url);
    event.respondWith(handleProxyRequest(event.request));
  } else {
    event.respondWith(
      caches.open(cacheStorageKey)
        .then(cache => cache.match(event.request, { ignoreSearch: true }))
        .then(response => {
          return response || fetchData(event.request);
          // if (response) {
          //   return response;
          // } else {
          //   return fetchData(event.request);
          // }
        })
    );
  }
});

async function handleProxyRequest(request) {
  try {
    const cacheResponse = await caches.match(request, { ignoreSearch: true });
    if (cacheResponse) {
      // console.log('[PWA] cached:', request.url);
      return cacheResponse;
    } else {
      return fetchData(request)
        .then(response => {
          if (response.ok) {
            // console.log('[PWA] get:', request.url);
            return response;
          } else {
            // console.log('[PWA] proxy for:', request.url);
            return fetchData(new Request(getMirrorRequired(request.url), request))
              .then(response => {
                // console.log('[PWA] Response status:', response.status);
                return response;
              });
          }
        })
        .catch(error => {
          // console.error('[PWA] proxy for:', request.url);
          return fetch(request);
        });
    }
  } catch (error) {
    console.error('[PWA] Proxy request failed:', error);
    // return new Response('Proxy request failed', { status: 500 });
    return fetch(request);
  }
}
