// $(document).ready(function(){
$(function () {
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

    /* 修复文章卡片 div 的宽度. */
    let fixPostCardWidth = function (srcId, targetId) {
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

    /**
     * 修复footer部分的位置，使得在内容比较少时，footer也会在底部.
     */
    let fixFooterPosition = function () {
        jQuery('.content').css('min-height', window.innerHeight - 165);
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
        progressBarInit();
    });

    Matery.events.registerRefreshCallback(function() {
        AOS.refresh();
        progressBarInit();
    });

    /*初始化瀑布流布局*/
    jQuery('#articles').masonry({
        itemSelector: '.article'
    });

    AOS.init({
        easing: 'ease-in-out-sine',
        duration: 700,
        delay: 100
    });

    $('#read_mode i').on('click', function (e) {
      if (e.target !== this) return
      $(this).parent().parent().parent().parent().toggleClass('card-block-fullscreen')
      $('html').toggleClass('card-block-fullscreen-html-scroll')
    });
    $('#read_mode span').on('click', function (e) {
      if (e.target !== this) return
      $(this).parent().parent().parent().parent().toggleClass('card-block-fullscreen')
      $('html').toggleClass('card-block-fullscreen-html-scroll')
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
        $('#articleContent, #myGallery').lightGallery({
            selector: '.img-item',
            // 启用字幕
            subHtmlSelectorRelative: true
        });

        // lazyload 与 gallery 冲突修复
        $(document).find('img[data-original]').each(function(){
            $(this).parent().attr("href", $(this).attr("data-original"));
        });

        // progress bar init
        // const progressElement = window.document.querySelector('.progress-bar');
        // if (progressElement) {
        //     new ScrollProgress((x, y) => {
        //         progressElement.style.width = y * 100 + '%';
        //     });
        // }
        progressBarInit();
    };
    articleInit();

    $('.modal').modal();

    /*回到顶部*/
    // $('#backTop').click(function () {
    //     $('body,html').animate({scrollTop: 0}, 400);
    //     return false;
    // });

    /*菜单切换*/
    jQuery('.sidenav').sidenav();

    /*监听滚动条位置*/
    let $nav = $('#headNav');
    let $backTop = $('.top-scroll');
    // 当页面处于文章中部的时候刷新页面，因为此时无滚动，所以需要判断位置,给导航加上绿色。
    showOrHideNavBg($(window).scrollTop());
    $(window).scroll(function () {
        /* 回到顶部按钮根据滚动条的位置的显示和隐藏.*/
        let scroll = $(window).scrollTop();
        showOrHideNavBg(scroll);
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

    /* PWA 相关 */
    // init PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
        .register('/sw.js')
        .then(function () {
            console.log("Service Worker Registered");
        });
    }

    let deferredPrompt;
    let blogTitle = themeStorage.getItem("title");

    window.addEventListener('beforeinstallprompt', function (e) {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        showAddToHomeScreen();
    });

    function showAddToHomeScreen() {
        let toastHTML = '<span>使<b>' + blogTitle + '</b>可以离线访问？</span><button class="btn-flat toast-action" onclick="addToHomeScreen()">Yes</button>';
        M.toast({html: toastHTML});
    }

    function addToHomeScreen() {
        deferredPrompt.prompt();  // Wait for the user to respond to the prompt
        deferredPrompt.userChoice
        .then(function (choiceResult) {
            if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
            } else {
            console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
        });
    }

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
function postTimeliness() {
    var times = document.getElementsByTagName('time');
    if (times.length === 0) { return; }
    var posts = document.getElementsByClassName('article-card-content');
    if (posts.length === 0) { return; }

    var pubTime = new Date(times[0].dateTime);  /* 文章发布时间戳 */
    var modTime = new Date(times[1].dateTime);  /* 文章更新时间戳 */
    var now = Date.now();  /* 当前时间戳 */
    var intervalPub = parseInt(now - pubTime);
    var intervalMod = parseInt(now - modTime)
    /* 发布时间超过指定时间（毫秒）一年 */
    if (intervalMod > 3600*24*30*12*1000){
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

