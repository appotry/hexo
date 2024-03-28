(function(e,t){typeof exports==="object"&&typeof module!=="undefined"?module.exports=t():typeof define==="function"&&define.amd?define(t):(e=typeof globalThis!=="undefined"?globalThis:e||self,e.lgRelativeCaption=t())})(this,function(){"use strict";var i=function(){i=Object.assign||function e(t){for(var i,o=1,l=arguments.length;o<l;o++){i=arguments[o];for(var n in i)if(Object.prototype.hasOwnProperty.call(i,n))t[n]=i[n]}return t};return i.apply(this,arguments)};var t={afterAppendSlide:"lgAfterAppendSlide",init:"lgInit",hasVideo:"lgHasVideo",containerResize:"lgContainerResize",updateSlides:"lgUpdateSlides",afterAppendSubHtml:"lgAfterAppendSubHtml",beforeOpen:"lgBeforeOpen",afterOpen:"lgAfterOpen",slideItemLoad:"lgSlideItemLoad",beforeSlide:"lgBeforeSlide",afterSlide:"lgAfterSlide",posterClick:"lgPosterClick",dragStart:"lgDragStart",dragMove:"lgDragMove",dragEnd:"lgDragEnd",beforeNextSlide:"lgBeforeNextSlide",beforePrevSlide:"lgBeforePrevSlide",beforeClose:"lgBeforeClose",afterClose:"lgAfterClose",rotateLeft:"lgRotateLeft",rotateRight:"lgRotateRight",flipHorizontal:"lgFlipHorizontal",flipVertical:"lgFlipVertical",autoplay:"lgAutoplay",autoplayStart:"lgAutoplayStart",autoplayStop:"lgAutoplayStop"};var o={relativeCaption:false};var e=function(){function e(e){this.core=e;var t={addClass:this.core.settings.addClass+" lg-relative-caption"};this.core.settings=i(i({},this.core.settings),t);this.settings=i(i(i({},o),this.core.settings),t);return this}e.prototype.init=function(){var l=this;if(!this.settings.relativeCaption){return}this.core.LGel.on(t.slideItemLoad+".caption",function(e){var t=e.detail,i=t.index,o=t.delay;setTimeout(function(){if(i===l.core.index){l.setRelativeCaption(i)}},o)});this.core.LGel.on(t.afterSlide+".caption",function(e){var t=e.detail.index;setTimeout(function(){var e=l.core.getSlideItem(t);if(e.hasClass("lg-complete")){l.setRelativeCaption(t)}})});this.core.LGel.on(t.beforeSlide+".caption",function(e){var t=e.detail.index;setTimeout(function(){var e=l.core.getSlideItem(t);e.removeClass("lg-show-caption")})});this.core.LGel.on(t.containerResize+".caption",function(e){l.setRelativeCaption(l.core.index)})};e.prototype.setCaptionStyle=function(e,t,i){var o=this.core.getSlideItem(e).find(".lg-relative-caption-item");var l=this.core.getSlideItem(e).find(".lg-sub-html");l.css("width",t.width+"px").css("left",t.left+"px");var n=o.get().getBoundingClientRect();var a=i.bottom-t.bottom-n.height;l.css("top","auto").css("bottom",Math.max(a,0)+"px")};e.prototype.setRelativeCaption=function(e){var t=this.core.getSlideItem(e);if(t.hasClass("lg-current")){var i=this.core.getSlideItem(e).find(".lg-object").get().getBoundingClientRect();var o=this.core.getSlideItem(e).get().getBoundingClientRect();this.setCaptionStyle(e,i,o);t.addClass("lg-show-caption")}};e.prototype.destroy=function(){this.core.LGel.off(".caption")};return e}();return e});