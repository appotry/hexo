HTMLElement.prototype.wrap=function($){this.parentNode.insertBefore($,this),this.parentNode.removeChild(this),$.appendChild(this)},Matery.events={registerNavbarEvent:function(){0!==jQuery("#headNav").length&&Matery.utils.listenScroll(function(){})},registerParallaxEvent:function(){var n,r=jQuery('#banner[parallax="true"]');0!==r.length&&0!==(n=jQuery("main.content")).length&&Matery.utils.listenScroll(function(){var $=jQuery(window).scrollTop()/5,e=96+parseInt(n.css("margin-top"),10);r.css({transform:"translate3d(0,"+($=e<$?e:$)+"px,0)"})})},registerScrollDownArrowEvent:function(){var $=jQuery(".cover.scroll-down-bar");0!==$.length&&$.on("click",function(){Matery.utils.scrollToElement("main.content",30-jQuery("#headNav").height())})},registerScrollBackCommentEvent:function(){var $=jQuery("#to_comment");0!==$.length&&$.on("click",function(){Matery.utils.scrollToElement("#comments",-jQuery("#headNav").height()),Matery.utils.scrollToElement("#comments",-jQuery("#headNav").height())})},registerScrollTopArrowEvent:function(){var $=jQuery("#backTop");0!==$.length&&0!==jQuery("main.content").length&&$.on("click",function(){jQuery("body,html").animate({scrollTop:0,easing:"swing"})})},registerImageLoadedEvent:function(){if("NProgress"in window){var $=jQuery("main img:not([lazyload])"),e=$.length;for(const n of $){const r=n.onload;n.onload=function(){r&&r(),window.NProgress&&window.NProgress.inc(.5/e)},n.complete&&n.onload()}}},registerRefreshCallback:function($){Array.isArray(Matery.events._refreshCallbacks)||(Matery.events._refreshCallbacks=[]),Matery.events._refreshCallbacks.push($)},refresh:function(){if(Array.isArray(Matery.events._refreshCallbacks))for(var $ of Matery.events._refreshCallbacks)$ instanceof Function&&$()},billboard:function(){"console"in window&&console.log(`
    __       __   ______   ________  ________  _______   __      __ 
    /       /  | /       /        |/        |/        /      /  |
    $$     /$$ |/$$$$$$  |$$$$$$$$/ $$$$$$$$/ $$$$$$$  |$$    /$$/ 
    $$$   /$$$ |$$ |__$$ |   $$ |   $$ |__    $$ |__$$ | $$  /$$/  
    $$$$  /$$$$ |$$    $$ |   $$ |   $$    |   $$    $$<   $$  $$/   
    $$ $$ $$/$$ |$$$$$$$$ |   $$ |   $$$$$/    $$$$$$$  |   $$$$/    
    $$ |$$$/ $$ |$$ |  $$ |   $$ |   $$ |_____ $$ |  $$ |    $$ |    
    $$ | $/  $$ |$$ |  $$ |   $$ |   $$       |$$ |  $$ |    $$ |    
    $$/      $$/ $$/   $$/    $$/    $$$$$$$$/ $$/   $$/     $$/  
                           
                欢迎访问 夜法之书 个人博客！
                  https://blog.17lai.site                                                           
    `)}};