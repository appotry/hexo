/* global Matery, CONFIG */

HTMLElement.prototype.wrap = function(wrapper) {
  this.parentNode.insertBefore(wrapper, this);
  this.parentNode.removeChild(this);
  wrapper.appendChild(this);
};

Matery.plugins = {

  typing: function(text) {
    if (!('Typed' in window)) { return; }

    var typed = new window.Typed('#subtitle', {
      strings: [
        '  ',
        text + '&nbsp;'
      ],
      cursorChar: CONFIG.typing.cursorChar,
      typeSpeed : CONFIG.typing.typeSpeed,
      loop      : CONFIG.typing.loop
    });
    typed.stop();
    var subtitle = document.getElementById('subtitle');
    if (subtitle) {
      subtitle.innerText = '';
    }
    jQuery(document).ready(function() {
      typed.start();
    });
  },

  fancyBox: function(selector) {
    if (!CONFIG.image_zoom.enable || !('fancybox' in jQuery)) { return; }

    jQuery(selector || '.markdown-body :not(a) > img, .markdown-body > img').each(function() {
      var $image = jQuery(this);
      var imageUrl = $image.attr('data-src') || $image.attr('src') || '';
      if (CONFIG.image_zoom.img_url_replace) {
        var rep = CONFIG.image_zoom.img_url_replace;
        var r1 = rep[0] || '';
        var r2 = rep[1] || '';
        if (r1) {
          if (/^re:/.test(r1)) {
            r1 = r1.replace(/^re:/, '');
            var reg = new RegExp(r1, 'gi');
            imageUrl = imageUrl.replace(reg, r2);
          } else {
            imageUrl = imageUrl.replace(r1, r2);
          }
        }
      }
      var $imageWrap = $image.wrap(`
        <a class="fancybox fancybox.image" href="${imageUrl}"
          itemscope itemtype="http://schema.org/ImageObject" itemprop="url"></a>`
      ).parent('a');
      if ($imageWrap.length !== 0) {
        if ($image.is('.group-image-container img')) {
          $imageWrap.attr('data-fancybox', 'group').attr('rel', 'group');
        } else {
          $imageWrap.attr('data-fancybox', 'default').attr('rel', 'default');
        }

        var imageTitle = $image.attr('title') || $image.attr('alt');
        if (imageTitle) {
          $imageWrap.attr('title', imageTitle).attr('data-caption', imageTitle);
        }
      }
    });

    jQuery.fancybox.defaults.hash = false;
    jQuery('.fancybox').fancybox({
      loop   : true,
      helpers: {
        overlay: {
          locked: false
        }
      }
    });
  },

  imageCaption: function(selector) {
    if (!CONFIG.image_caption.enable) { return; }

    jQuery(selector || `.markdown-body > p > img, .markdown-body > figure > img,
      .markdown-body > p > a.fancybox, .markdown-body > figure > a.fancybox`).each(function() {
      var $target = jQuery(this);
      var $figcaption = $target.next('figcaption');
      if ($figcaption.length !== 0) {
        $figcaption.addClass('image-caption');
      } else {
        var imageTitle = $target.attr('title') || $target.attr('alt');
        if (imageTitle) {
          $target.after(`<figcaption aria-hidden="true" class="image-caption">${imageTitle}</figcaption>`);
        }
      }
    });
  },

  codeWidget() {
    var enableLang = CONFIG.code_language.enable && CONFIG.code_language.default;
    var enableCopy = CONFIG.copy_btn;
    var enableShowfull  = CONFIG.show_full;
    var enableShowexpand  = CONFIG.show_expand;
    var enableShrink    = CONFIG.shrink;
    var enableBreak     = CONFIG.break;
    if (!enableLang && !enableCopy && !enableShowfull && !enableShrink && !enableBreak) {
      return;
    }

    function getBgClass(ele) {
      return Matery.utils.getBackgroundLightness(ele) >= 0 ? 'code-widget-light' : 'code-widget-dark';
    }

    jQuery('.markdown-body pre').each(function() {
      var $pre = jQuery(this);
      if ($pre.find('code.mermaid').length > 0) {
        return;
      }
      if ($pre.find('span.line').length > 0) {
        return;
      }
      // scripts/events/lib/highlight.js 中已经添加了 所以这里注释掉
      //$pre.wrap('<div class="code-area"></div>');
    });

    //jQuery('.markdown-body pre').each(function() {
      //var $pre = jQuery('.markdown-body pre');
      // if ($pre.find('code.mermaid').length > 0) {
      //   return;
      // }
      // if ($pre.find('span.line').length > 0) {
      //   return;
      // }

      // 代码块功能依赖
      //$pre.wrap('<div class="code-area" style="position: relative"></div>');

      var $pre = jQuery('.markdown-body .code-area pre');
      if (enableLang) {
        var $highlight_lang = $('<div class="code_lang" title="代码语言"></div>');

        $pre.before($highlight_lang);
        $pre.each(function () {
          var code_language = $(this).attr('class');

          if (!code_language) {
            return true;
          };
          var lang_name = code_language.replace("line-numbers", "").trim().replace("language-", "").trim();

          // 首字母大写
          // lang_name = lang_name.slice(0, 1).toUpperCase() + lang_name.slice(1);

          $(this).siblings(".code_lang").text(lang_name);
        });

      }

      if (enableCopy) {
        var $copyIcon = $('<i class="fas fa-clipboard code_copy" title="复制代码" aria-hidden="true"></i>')
        var $notice = $('<div class="codecopy_notice"></div>')
        //$('.code-area').prepend($copyIcon).prepend($notice);
        $pre.before($copyIcon).before($notice);
        // “复制成功”字出现
        function copy(text, ctx) {
            if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
                try {
                    document.execCommand('copy') // Security exception may be thrown by some browsers.
                    $(ctx).prev('.codecopy_notice')
                        .text("复制成功")
                        .animate({
                            opacity: 1,
                            top: 30
                        }, 450, function () {
                            setTimeout(function () {
                                $(ctx).prev('.codecopy_notice').animate({
                                    opacity: 0,
                                    top: 0
                                }, 650)
                            }, 400)
                        })
                } catch (ex) {
                    $(ctx).prev('.codecopy_notice')
                        .text("复制失败")
                        .animate({
                            opacity: 1,
                            top: 30
                        }, 650, function () {
                            setTimeout(function () {
                                $(ctx).prev('.codecopy_notice').animate({
                                    opacity: 0,
                                    top: 0
                                }, 650)
                            }, 400)
                        })
                    return false
                }
            } else {
                $(ctx).prev('.codecopy_notice').text("浏览器不支持复制")
            }
        }
        // 复制
        $('.code-area .code_copy').on('click', function () {
            var selection = window.getSelection()
            var range = document.createRange()
            range.selectNodeContents($(this).siblings('pre').find('code')[0])
            selection.removeAllRanges()
            selection.addRange(range)
            var text = selection.toString()
            copy(text, this)
            selection.removeAllRanges()
        })
      }

      if (enableShowfull) {
        var $code_full = $('<div class="scroll-down-bar"><i class="fas fa-angle-down" ></i></div>');

        //$('.code-area').prepend($code_full);
        $pre.before($code_full);
        $('.code-area pre').each(function (index, value) {
          if ($(this).height() >= 405 ) {
            $(this).parent().addClass('show-code-full');
            AOS.refresh(); //高度改变 刷新视图
            progressBarInit();
          }
        });

        $('.code-area .scroll-down-bar').on('click', function () {
          if ($(this).parent().hasClass('code-full')) {
            $(this).parent().removeClass('code-full');
          } else {
            $(this).parent().addClass('code-full');
          }
          AOS.refresh(); //高度改变 刷新视图
          progressBarInit();
        });
      }

      if (enableShrink) {
        var $code_expand = $('<i class="fas fa-angle-down code-expand" aria-hidden="true"></i>');

        //$('.code-area').prepend($code_expand);
        $pre.before($code_expand);
        $('.code-area .code-expand').on('click', function () {
          if ($(this).parent().hasClass('code-closed')) {
            $(this).siblings('pre').find('code').show();
            $(this).parent().removeClass('code-closed');
          } else {
            $(this).siblings('pre').find('code').hide();
            $(this).parent().addClass('code-closed');
          }
          AOS.refresh(); //高度改变 刷新视图
          progressBarInit();
        });
      }

      if (enableShowexpand) {
        var $code_show_expand = $('<i class="fas fa-expand code-show-expand"  title="全屏显示" aria-hidden="true"></i>');
        $pre.before($code_show_expand);
        $('.code-area .code-show-expand').on('click', function (e) {
          if (e.target !== this) return
          if ($(this).parent().hasClass('code-closed')) {
            $(this).siblings('pre').find('code').show();
            $(this).parent().removeClass('code-closed');
          }
          //$(this).parent().toggleClass('code-block-fullscreen');
          //$('html').toggleClass('code-block-fullscreen-html-scroll');

          if ($(this).parent().hasClass('code-block-fullscreen')) {
            $(this).parent().removeClass('code-block-fullscreen');
            $('html').removeClass('code-block-fullscreen-html-scroll');
          } else {
            $(this).parent().addClass('code-block-fullscreen');
            $('html').addClass('code-block-fullscreen-html-scroll');          
          }
        });
      }

      Matery.events.registerRefreshCallback(function() {
        Prism.highlightAll();
      });

      if (enableBreak) {

      }

    //});

  }
};
