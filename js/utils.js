$(document).ready(function(){
//  $(function () {
    /**
     * 添加文章卡片hover效果.
     */
    let articleCardHover = function () {
        let animateClass = 'animated pulse';
        $('article .article').hover(function () {
            $(this).addClass(animateClass);
        }, function () {
            $(this).removeClass(animateClass);
        });

        $('#recommend-sections .post-card').hover(function () {
            $(this).addClass(animateClass);
        }, function () {
            $(this).removeClass(animateClass);
        });
    };
    articleCardHover();

    /**
     * 修复footer部分的位置，使得在内容比较少时，footer也会在底部.
     */
    let fixFooterPosition = function () {
        jQuery('main.content').css('min-height', window.innerHeight - 165);
    };

    /**
     * 修复样式.
     */
    let fixStyles = function () {
        fixPostCardWidth('navContainer');
        fixPostCardWidth('artDetail', 'prenext-posts');
        fixFooterPosition();
    };
    fixStyles();

    /*调整屏幕宽度时重新设置文章列的宽度，修复小间距问题*/
    jQuery(window).resize(function () {
        fixStyles();
        AOS.refresh();
        // 调用 Materialize 的初始化方法
        // M.AutoInit();
        jQuery('#articles').masonry('reloadItems');
        progressBarInit();
    });

    /*初始化瀑布流布局*/
    jQuery('#articles').masonry({
        itemSelector: '.article'
    });
    /* materialize init*/
    AOS.init({
        easing: 'ease-in-out-sine',
        duration: 700,
        delay: 100,
        disable: function () {
          var maxWidth = 960;
          return window.innerWidth < maxWidth;
        }
    });
    
    /*阅读模式控制*/
    $('#read_mode i, #read_mode span, .code-area .code-show-expand').on('click', function (e) {
      if (e.target !== this) return;
    
      // 判断点击对象是否是代码块的放大按钮
      var isCodeExpandButton = $(this).hasClass('code-show-expand');
      var $parentCard = $(this).parent().parent().parent().parent();
      
      // 切换阅读模式
      $parentCard.toggleClass('card-block-fullscreen');
      $('html').toggleClass('card-block-fullscreen-html-scroll');
      
      // 切换代码块的放大状态
      if (isCodeExpandButton) {
        if ($parentCard.hasClass('code-block-fullscreen')) {
          $parentCard.removeClass('code-block-fullscreen');
          $('html').removeClass('code-block-fullscreen-html-scroll');
        } else {
          $parentCard.addClass('code-block-fullscreen');
          $('html').addClass('code-block-fullscreen-html-scroll');          
        }
      }
      
      // 切换图标
      var $icon = $(this).is('i') ? $(this) : $(this).prev('i');
      if ($icon.hasClass('fa-expand-arrows-alt')) {
        $icon.removeClass('fa-expand-arrows-alt').addClass('fa-compress-arrows-alt');
      } else {
        $icon.removeClass('fa-compress-arrows-alt').addClass('fa-expand-arrows-alt');
      }
    });

    /*文章内容详情的一些初始化特性*/
    let articleInit = function () {
        $("#articleContent a[href^='http']").attr('target', '_blank');

        $('#articleContent img').each(function () {
            let imgPath = $(this).attr('src');
            $(this).wrap('<div class="img-item" data-src="' + imgPath + '" data-sub-html=".caption"></div>');
            //图片限制大小
            $(this).css('max-width','99%')
            // 图片添加阴影
            $(this).addClass("img-shadow img-margin");
            // 图片添加字幕
            let alt = $(this).attr('alt');
            let title = $(this).attr('title');
            let captionText = "";
            // 如果alt为空，title来替
            if (alt === undefined || alt === "") {
                if (title !== undefined && title !== "") {
                    captionText = title;
                }
            } else {
                captionText = alt;
            }
            // 字幕不空，添加之
            if (captionText !== "") {
                let captionDiv = document.createElement('div');
                captionDiv.className = 'caption';
                let captionEle = document.createElement('b');
                captionEle.className = 'center-caption';
                captionEle.innerText = captionText;
                captionDiv.appendChild(captionEle);
                this.insertAdjacentElement('afterend', captionDiv)
            }
        });
        // lightGallery初始化
        $('#articleContent, #myGallery').lightGallery({
            selector: '.img-item',
            // 启用字幕
            subHtmlSelectorRelative: true
        });

        // lazyload 插件 与 lightGallery 冲突修复
        // $(document).find('img[data-original]').each(function(){
        //     $(this).parent().attr("href", $(this).attr("data-original"));
        // });

        // progress bar init
        // const progressElement = window.document.querySelector('.progress-bar');
        // if (progressElement) {
        //     new ScrollProgress((x, y) => {
        //         progressElement.style.width = y * 100 + '%';
        //     });
        // }
    };
    articleInit();
    progressBarInit();

    Matery.events.registerRefreshCallback(function() {
      fixStyles();
      AOS.refresh();
      // 调用 Materialize 的初始化方法
      // M.AutoInit();
      jQuery('#articles').masonry('reloadItems');
      progressBarInit();
    });

    $('.modal').modal();

    /*回到顶部*/
    // $('#backTop').click(function () {
    //     $('body,html').animate({scrollTop: 0}, 400);
    //     return false;
    // });

    /*菜单切换*/
    jQuery('#headNav .sidenav').sidenav();

    /* 监听滚动条位置 */
    let $nav = $('#headNav');
    let $backTop = $('.top-scroll');
    var lastScroll = 0;
    // 当页面处于文章中部的时候刷新页面，因为此时无滚动，所以需要判断位置,给导航加上绿色。
    showOrHideNavBg($(window).scrollTop());
    $(window).scroll(function () {
      /* 回到顶部按钮根据滚动条的位置的显示和隐藏. */
      let scroll = $(window).scrollTop();
      showOrHideNavBg(scroll);

      /* 文章详情页向下滚动时隐藏顶部导航 */
      if ($('#artDetail').length > 0) {
        if (lastScroll - scroll <= 0) {
          if (scroll > 100) {
            // 隐藏详情页顶部导航
            $nav.removeClass('nav-transparent');
            $nav.addClass('nav-transparent-none');
          }
        } else {
          /* 反方向滚动屏幕恢复菜单 */
          $nav.removeClass('nav-transparent-none');
        }
        lastScroll = scroll;
        // $backTop.slideDown(300);
      }
    });

    function showOrHideNavBg(position) {
        let showPosition = 100;
        if (position < showPosition) {
            $nav.addClass('nav-transparent');
            $backTop.slideUp(300);
        } else {
            $nav.removeClass('nav-transparent');
            $backTop.slideDown(300);
        }
    }

	$(".nav-menu>li").hover(function(){
		$(this).children('ul').stop(true,true).show();
		$(this).addClass('nav-show').siblings('li').removeClass('nav-show');

	},function(){
		$(this).children('ul').stop(true,true).hide();
		$('.nav-item.nav-show').removeClass('nav-show');
	})

    $('.m-nav-item>a').on('click',function(){
        if ($(this).next('ul').css('display') == "none") {
            $('.m-nav-item').children('ul').slideUp(300);
            $(this).next('ul').slideDown(100);
            $(this).parent('li').addClass('m-nav-show').siblings('li').removeClass('m-nav-show');
        }else{
            $(this).next('ul').slideUp(100);
            $('.m-nav-item.m-nav-show').removeClass('m-nav-show');
        }
    });

    // 初始化加载 tooltipped.
    jQuery('.tooltipped').tooltip();

});

function windowResizeEvent() {
  window.onresize = function() {
      var target = this;
      if (target.resizeFlag) {
          clearTimeout(target.resizeFlag);
      }

      target.resizeFlag = setTimeout(function() {
          AOS.refresh();
          target.resizeFlag = null;
      }, 100);
  }
}

function progressBarInit() {
    // progress bar init
    const progressElement = window.document.querySelector('.progress-bar');
    if (progressElement) {
        new ScrollProgress((x, y) => {
            progressElement.style.width = y * 100 + '%';
        });
    }
}

function scrollToElement(target, offset) {
    var of = jQuery(target).offset();
    if (of) {
        jQuery('html,body').animate({
            scrollTop: of.top + (offset || 0),
            easing   : 'swing'
        });
    }
}

function registerScrollDownArrowEvent() {
    var scrollbar = jQuery('.cover.scroll-down-bar');
    if (scrollbar.length === 0) {
        return false;
    }
    scrollbar.on('click', function() {
        scrollToElement('main.content', -jQuery('#headNav').height() + 30);
    });
}

function registerScrollBackCommentEvent() {
    var scrollbar = jQuery('#to_comment');
    if (scrollbar.length === 0) {
        return false;
    }
    scrollbar.on('click', function() {
        scrollToElement('#comments', -jQuery('#headNav').height() + 30);
    });
}

// 文章时效性提示
function postOutdate() {
    var times = document.getElementsByTagName('time');
    if (times.length === 0) { return; }
    var posts = document.getElementsByClassName('article-card-content');
    if (posts.length === 0) { return; }

    var pubTime = new Date(times[0].dateTime);  /* 文章发布时间戳 */
    var modTime = new Date(times[1].dateTime);  /* 文章更新时间戳 */
    var now = Date.now();  /* 当前时间戳 */
    var intervalPub = parseInt(now - pubTime);
    var intervalMod = parseInt(now - modTime);
    var warning_day = CONFIG.outdate.warning_day;
    /* 发布时间超过指定时间（毫秒）一年 */
    if (intervalMod > 3600*24*warning_day*1000){
        var pubdays = parseInt(intervalPub / 86400000);
        var moddays = parseInt(intervalMod / 86400000);
        // articleContent.innerHTML = '<div class="note note-warning" style="font-size:0.9rem"><p>' +
        // '<div class="h6">文章时效性提示</div><p>这是一篇发布于 ' + days + ' 天前的文章，部分信息可能已发生改变，请注意甄别。' +
        // '</p></p></div>' + articleContent.innerHTML;

        articleContent.innerHTML = '<div class="admonition warning"><p class="admonition-title">文章时效性提示</p><p>这是一篇发布于 '
              + pubdays + ' 天前，最近更新于 ' + moddays + ' 天前的文章，部分信息可能已发生改变，请注意甄别！' +
        '</p></div>' + articleContent.innerHTML;
    }
}

function setLS(k, v) {
    try {
        localStorage.setItem(k, v);
    } catch (e) {}
}

function removeLS(k) {
    try {
        localStorage.removeItem(k);
    } catch (e) {}
}

function getLS(k) {
    try {
        return localStorage.getItem(k);
    } catch (e) {
        return null;
    }
}

function registerColorToggleCallback( erChart, elementId, option ) {
    var colorToggleButtonSelector = '#color-toggle-btn';
    var colorToggleButton = document.querySelector(colorToggleButtonSelector);

    colorToggleButton.addEventListener('click', function() {
        erChart.dispose();
        erChart = echarts.init(document.getElementById(elementId), getLS(colorSchemaInitStorageKey));
        erChart.setOption(option);
    });
}

/* 修复文章卡片 div 的宽度. */
function fixPostCardWidth (srcId, targetId) {
  let srcDiv = $('#' + srcId);
  if (srcDiv.length === 0) {
      return;
  }

  let w = srcDiv.width();
  if (w >= 450) {
      w = w + 21;
  } else if (w >= 350 && w < 450) {
      w = w + 18;
  } else if (w >= 300 && w < 350) {
      w = w + 16;
  } else {
      w = w + 14;
  }
  $('#' + targetId).width(w);
};

// 页内平滑跳转
function inPageScroll() {

    var forEach = function (array, callback, scope) {
        for (var i = 0; i < array.length; i++) {
            callback.call(scope, i, array[i]);
        }
    };

    var anchorLinks = document.querySelectorAll("#articleContent a[href^='#']");
    if (window.scrollTo) {
        forEach(anchorLinks, function(index, element) {
            var target = document.getElementById(element.getAttribute("href").substring(1));
            element.addEventListener("click", function(el) {
                el.preventDefault();
                window.scrollTo(0, target.offsetTop);
            })
        });
    }
}

// function scrollGetPost() {
//     jQuery.ajax({
//         url: 'https://blog.17lai.fun/page/2/',
//         method: 'GET',
//         success: function(data) {
//             var newdoc = "";
//             var load = document.createElement( 'html' );

//             const parser = new DOMParser();
//             const doc = parser.parseFromString(data, "text/html");

//             // console.log(data);
//             console.log(doc)

//             // var articlerow = document.getElementById('articles');
//             var articlerow = document.getElementsByClassName('article-row');
//             newdoc = doc.getElementsByClassName('article');
//             for(let i=0;i<newdoc.length;i++){
//                 // myArticles.appendChild(load[i]);

//                 // jQuery("#article-row").append(newdoc[i]);
//                 articlerow[0].appendChild(newdoc[i]);

//                 // articles.innerHTML = articles.innerHTML + newdoc[i];
//                 console.log(newdoc[i]);


//                 // const template = `<div class='addchild'>测试添加</div>`;
//                 // let doc = new DOMParser().parseFromString(template, 'text/html');
//                 // let div = doc.querySelector('.addchild');
//                 // articlerow.appendChild(div);
//             }

//             off_on = true;
//             AOS.refresh(); //高度改变 刷新视图
//         },
//         error: function(error) {
//             console.log(error);
//         }
//     });
// }



function handleVideoWithCondition(windowWidth, viewCount) {
  if ($(window).width() > windowWidth && Number(viewCount) > 3) {
      var jsonUrl = CONFIG.fun_features.videobg.url;
      // 从远程获取 JSON 数据
      $.getJSON(jsonUrl, function(data) {
        // 处理获取到的 JSON 数据
        handleVideoData(data);
      });
  }
}

function setAjaxBackgroundImage(imageUrl, insertLocation) {
    $.ajax({
        url: imageUrl,
        method: "GET",
        cache: true, // 缓存文件
        success: function() {
            // 创建新的 <img> 元素
            var image = $("<img>");
            image.attr("src", imageUrl);

            // 设置图片作为背景
            image.css({
                "background-image": "url(" + imageUrl + ")",
                "background-repeat": "no-repeat",
                "background-size": "cover",
                "background-attachment": "fixed",
                "position": "fixed",
                "height": "100%",
                "z-index": "-999"
            });

            // 根据 body 的宽高设置视频属性
            adjustVideoSize(image);

            jQuery(window).resize(function () {
                adjustVideoSize(image);
            });

            insertLocation.prepend(image);
        }
    });
}

/* 视频动态背景功能 */
function setBackgroundImage(imageUrl, insertLocation) {
    // 创建新的 <img> 元素
    var image = $("<img>");

    // 预加载图像
    image.on("load", function() {
        // 设置图片作为背景
        image.css({
            "background-image": "url(" + imageUrl + ")",
            "background-repeat": "no-repeat",
            "background-size": "cover",
            "background-attachment": "fixed",
            "position": "fixed",
            "height": "100%",
            "z-index": "-999"
        });

        // 根据 body 的宽高设置视频属性
        adjustVideoSize(image);

        jQuery(window).resize(function () {
            adjustVideoSize(image);
        });

        // 将图像插入到指定位置
        insertLocation.prepend(image);
    });

    // 设置图像的 src 属性以触发加载
    image.attr("src", imageUrl);
}

// 根据 body 的宽高设置图片属性
function adjustVideoSize(body) {
    var height = document.documentElement.clientHeight;
    var width = document.documentElement.clientWidth;

    if (height / width < 0.56) {
        body.css({
            "width": "100%",
            "height": "auto"
        });
        // console.log("w 100vh  h auto");
    } else {
        body.css({
            "width": "auto",
            "height": "100%"
        });
        // console.log("w auto h 100vh");
    }
}

function insertAjaxVideo(videoUrl, insertLocation) {
    $.ajax({
        url: videoUrl,
        method: "GET",
        cache: true, // 缓存文件
        success: function() {
            // 创建 video 元素
            var video = document.createElement("video");
            video.src = videoUrl;
            video.autoplay = true; // 自动播放
            video.loop = true; // 循环播放
            video.muted = true; // 静音
            video.style.position = "fixed";
            video.style.zIndex = "-888";

            // 根据 body 的宽高设置视频属性
            adjustVideoSize($(video));

            jQuery(window).resize(function () {
                adjustVideoSize($(video));
            });

            // 添加到指定位置
            insertLocation.prepend(video);
        }
    });
}
function insertVideo(videoUrl, insertLocation) {
    // 创建 video 元素
    var video = document.createElement("video");
    video.src = videoUrl;
    video.autoplay = true; // 自动播放
    video.loop = true; // 循环播放
    video.muted = true; // 静音
    video.style.position = "fixed";
    video.style.zIndex = "-888";

    // 监听视频加载完成事件
    video.addEventListener("loadedmetadata", function() {
      // 根据 body 的宽高设置视频属性
      adjustVideoSize($(video));

      // 监听窗口大小变化事件，根据 body 的宽高设置视频属性
      window.addEventListener("resize", function () {
          adjustVideoSize($(video));
      });

      // 添加到指定位置
      insertLocation.prepend(video);
    });
}

//var insertLocation = $("body");
//var imageUrl = "https://cdn.17lai.fun/media/video/01/20210808220556.webp";
//setBackgroundImage(imageUrl, insertLocation);

//var videoUrl = "https://cdn.17lai.fun/media/video/01/20210808220556.webm";
//insertVideo(videoUrl, insertLocation);

function handleVideoData(data) {
    if (true) {
        var video_list_length = data.length;
        var seed = Math.random();
        index = Math.floor(seed * video_list_length);

        videoUrl = data[index][0];
        imageUrl = data[index][1];
    
        var insertLocation = $("body");
        setBackgroundImage(imageUrl, insertLocation);

        // $('.bg-cover.about-cover').css('background-image', 'none');
        // $('#banner bg-cover').css('background-image', 'none');
        // $('.bg-cover-after').css({
        //     '-webkit-animation': 'none',
        //     'animation': 'none'
        // });

        var ua = navigator.userAgent;
        var isMobile = null;
        if (ua) {
        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
        var isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
        var isAndroid = ua.match(/(Android)\s+([\d.]+)/);
        var isMobile = isIphone || isAndroid;
        } else {
        // 如果ua为null或undefined，则执行默认操作
        
        console.log("无法确定用户代理，执行默认操作");
        }

        if (isMobile === null) {
            var insertLocation = $("body");
            insertVideo(videoUrl, insertLocation);
            // console.log("加载视频背景" + videoUrl);
        }
    }
}


/* global Matery, CONFIG */

window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

Matery.utils = {

  listenScroll: function(callback) {
    var dbc = new Debouncer(callback, 100); // 设置延迟时间为 0.1 秒（100 毫秒）
    window.addEventListener('scroll', dbc, false);
    dbc.handleEvent();
    return dbc;
  },

  unlistenScroll: function(callback) {
    window.removeEventListener('scroll', callback);
  },

  listenDOMLoaded(callback) {
    if (document.readyState !== 'loading') {
      callback();
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        callback();
      });
    }
  },

  scrollToElement: function(target, offset) {
    var of = jQuery(target).offset();
    if (of) {
      jQuery('html,body').animate({
        scrollTop: of.top + (offset || 0),
        easing   : 'swing'
      });
    }
  },

  throttle: function(callback, delay) {
    var wait = arguments.length <= 1 || arguments[1] === undefined ? 100 : delay;

    var timer = null;
    return function () {
      var _this = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (timer === null) {
        timer = setTimeout(function () {
          callback.apply(_this, args);
          timer = null;
        }, wait);
      }
    };
  },

  elementVisible: function(element, offsetFactor) {
    offsetFactor = offsetFactor && offsetFactor >= 0 ? offsetFactor : 0;
    var rect = element.getBoundingClientRect();
    const viewportHeight = (window.innerHeight || document.documentElement.clientHeight) * (1 + offsetFactor);
    const viewportWidth = (window.innerWidth || document.documentElement.clientWidth) * (1 + offsetFactor);

    // 判断元素的顶部、底部、左侧或右侧是否在视口内
    // 如果有一个在视口内,则认为元素可见
    return rect.top < viewportHeight || rect.bottom > 0 || rect.left < viewportWidth || rect.right > 0;
  },

  waitElementVisible: function(selectorOrElement, callback, offsetFactor) {
    var runningOnBrowser = typeof window !== 'undefined';
    var isBot = (runningOnBrowser && !('onscroll' in window))
      || (typeof navigator !== 'undefined' && /(gle|ing|ro|msn)bot|crawl|spider|yand|duckgo/i.test(navigator.userAgent));
    if (!runningOnBrowser || isBot) {
      return;
    }

    offsetFactor = offsetFactor && offsetFactor >= 0 ? offsetFactor : 0;

    // 使用节流函数来控制回调函数的执行频率
    var throttledCallback = Matery.utils.throttle(callback, 200); // 200 毫秒的节流时间间隔

    function waitInViewport(element) {
      // 1. 监听 DOMContentLoaded 事件，确保 DOM 结构加载完成
      Matery.utils.listenDOMLoaded(function() {
        // 2. 判断元素是否已加载，如果已加载则直接执行回调函数
        if (element.classList.contains('loaded')) {
          throttledCallback(); // 使用节流函数执行回调
          return;
        }
        // 3. 判断元素是否可见，如果可见则执行回调函数
        if (Matery.utils.elementVisible(element, offsetFactor)) {
          throttledCallback(); // 使用节流函数执行回调
          return;
        }
        // 4. 如果浏览器支持 IntersectionObserver，则使用它来监听元素是否进入视口
        if ('IntersectionObserver' in window) {
          var io = new IntersectionObserver(function(entries, ob) {
            if (entries[0].isIntersecting) {
              throttledCallback(); // 使用节流函数执行回调
              ob.disconnect();
            }
          }, {
            threshold : [0],
            rootMargin: (window.innerHeight || document.documentElement.clientHeight) * offsetFactor + 'px'
          });
          io.observe(element);
        } else {
          // 5. 否则，回退到监听 scroll 事件的方式来判断元素是否可见
          var wrapper = Matery.utils.listenScroll(function() {
            if (Matery.utils.elementVisible(element, offsetFactor)) {
              Matery.utils.unlistenScroll(wrapper);
              throttledCallback(); // 使用节流函数执行回调
            }
          });
        }
      });
    }

    if (typeof selectorOrElement === 'string') {
      // 如果参数为字符串，则表示选择器，先等待选择器对应的元素加载完毕，然后执行回调
      this.waitElementLoaded(selectorOrElement, function(element) {
        waitInViewport(element);
      });
    } else {
      // 如果参数为元素，则直接等待元素可见，然后执行回调
      waitInViewport(selectorOrElement);
    }
  },

  // 对动态插入元素进行特殊处理
  waitElementLoaded: function(selector, callback) {
    var runningOnBrowser = typeof window !== 'undefined';
    var isBot = (runningOnBrowser && !('onscroll' in window))
      || (typeof navigator !== 'undefined' && /(gle|ing|ro|msn)bot|crawl|spider|yand|duckgo/i.test(navigator.userAgent));
    if (!runningOnBrowser || isBot) {
      return;
    }

    // 使用 MutationObserver 来监听元素插入
    if ('MutationObserver' in window) {
      var mo = new MutationObserver(function(records, ob) {
        var ele = document.querySelector(selector);
        if (ele) {
          callback(ele);
          ob.disconnect();
        }
      });
      mo.observe(document, { childList: true, subtree: true });
    } else {
      Matery.utils.listenDOMLoaded(function() {
        var waitLoop = function() {
          var ele = document.querySelector(selector);
          if (ele) {
            callback(ele);
          } else {
            setTimeout(waitLoop, 100);
          }
        };
        waitLoop();
      });
    }
  },

  createScript: function(url, onload) {
    var s = document.createElement('script');
    s.setAttribute('src', url);
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('charset', 'UTF-8');
    s.async = false;
    if (typeof onload === 'function') {
      if (window.attachEvent) {
        s.onreadystatechange = function() {
          var e = s.readyState;
          if (e === 'loaded' || e === 'complete') {
            s.onreadystatechange = null;
            onload();
          }
        };
      } else {
        s.onload = onload;
      }
    }
    var ss = document.getElementsByTagName('script');
    var e = ss.length > 0 ? ss[ss.length - 1] : document.head || document.documentElement;
    e.parentNode.insertBefore(s, e.nextSibling);
  },

  createAsyncScript: function(url, isAsync, onload) {
    var s = document.createElement('script');
    s.setAttribute('src', url);
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('charset', 'UTF-8');
    s.async = isAsync;
    if (typeof onload === 'function') {
      if (window.attachEvent) {
        s.onreadystatechange = function() {
          var e = s.readyState;
          if (e === 'loaded' || e === 'complete') {
            s.onreadystatechange = null;
            onload();
          }
        };
      } else {
        s.onload = onload;
      }
    }
    var ss = document.getElementsByTagName('script');
    var e = ss.length > 0 ? ss[ss.length - 1] : document.head || document.documentElement;
    e.parentNode.insertBefore(s, e.nextSibling);
  },

  createCssLink: function(url) {
    var l = document.createElement('link');
    l.setAttribute('rel', 'stylesheet');
    l.setAttribute('type', 'text/css');
    l.setAttribute('href', url);
    var e = document.getElementsByTagName('link')[0]
      || document.getElementsByTagName('head')[0]
      || document.head || document.documentElement;
    e.parentNode.insertBefore(l, e);
  },

  loadComments: function(selector, loadFunc) {
    var ele = document.querySelector('#comments[lazyload]');
    if (ele) {
      var callback = function() {
        loadFunc();
        ele.removeAttribute('lazyload');
      };
      Matery.utils.waitElementVisible(selector, callback, CONFIG.lazyload.offset_factor);
    } else {
      loadFunc();
    }
  },

  getBackgroundLightness(selectorOrElement) {
    var ele = selectorOrElement;
    if (typeof selectorOrElement === 'string') {
      ele = document.querySelector(selectorOrElement);
    }
    var view = ele.ownerDocument.defaultView;
    if (!view) {
      view = window;
    }
    var rgbArr = view.getComputedStyle(ele).backgroundColor.replace(/rgba*\(/, '').replace(')', '').split(/,\s*/);
    if (rgbArr.length < 3) {
      return 0;
    }
    var colorCast = (0.213 * rgbArr[0]) + (0.715 * rgbArr[1]) + (0.072 * rgbArr[2]);
    return colorCast === 0 || colorCast > 255 / 2 ? 1 : -1;
  },

  retry(handler, interval, times) {
    if (times <= 0) {
      return;
    }
    var next = function() {
      if (--times >= 0 && !handler()) {
        setTimeout(next, interval);
      }
    };
    setTimeout(next, interval);
  }

};

/**
 * Handles debouncing of events via requestAnimationFrame
 * @see http://www.html5rocks.com/en/tutorials/speed/animations/
 * @param {Function} callback The callback to handle whichever event
 */
function Debouncer(callback) {
  this.callback = callback;
  this.ticking = false;
}
Debouncer.prototype = {
  constructor: Debouncer,

  /**
   * dispatches the event to the supplied callback
   * @private
   */
  update: function() {
    this.callback && this.callback();
    this.ticking = false;
  },

  /**
   * ensures events don't get stacked
   * @private
   */
  requestTick: function() {
    if (!this.ticking) {
      requestAnimationFrame(this.rafCallback || (this.rafCallback = this.update.bind(this)));
      this.ticking = true;
    }
  },

  /**
   * Attach this as the event listeners
   */
  handleEvent: function() {
    this.requestTick();
  }
};

