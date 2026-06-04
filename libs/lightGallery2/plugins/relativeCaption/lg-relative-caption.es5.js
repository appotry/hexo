/*!
 * lightgallery | 2.7.2 | September 20th 2023
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var __assign=function(){return __assign=Object.assign||function(e){for(var t,i=1,o=arguments.length;i<o;i++)for(var l in t=arguments[i])Object.prototype.hasOwnProperty.call(t,l)&&(e[l]=t[l]);return e},__assign.apply(this,arguments)},lGEvents={afterAppendSlide:"lgAfterAppendSlide",init:"lgInit",hasVideo:"lgHasVideo",containerResize:"lgContainerResize",updateSlides:"lgUpdateSlides",afterAppendSubHtml:"lgAfterAppendSubHtml",beforeOpen:"lgBeforeOpen",afterOpen:"lgAfterOpen",slideItemLoad:"lgSlideItemLoad",beforeSlide:"lgBeforeSlide",afterSlide:"lgAfterSlide",posterClick:"lgPosterClick",dragStart:"lgDragStart",dragMove:"lgDragMove",dragEnd:"lgDragEnd",beforeNextSlide:"lgBeforeNextSlide",beforePrevSlide:"lgBeforePrevSlide",beforeClose:"lgBeforeClose",afterClose:"lgAfterClose",rotateLeft:"lgRotateLeft",rotateRight:"lgRotateRight",flipHorizontal:"lgFlipHorizontal",flipVertical:"lgFlipVertical",autoplay:"lgAutoplay",autoplayStart:"lgAutoplayStart",autoplayStop:"lgAutoplayStop"},relativeCaptionSettings={relativeCaption:!1},RelativeCaption=function(){function e(e){this.core=e;var t={addClass:this.core.settings.addClass+" lg-relative-caption"};return this.core.settings=__assign(__assign({},this.core.settings),t),this.settings=__assign(__assign(__assign({},relativeCaptionSettings),this.core.settings),t),this}return e.prototype.init=function(){var e=this;this.settings.relativeCaption&&(this.core.LGel.on(lGEvents.slideItemLoad+".caption",function(t){var i=t.detail,o=i.index,l=i.delay;setTimeout(function(){o===e.core.index&&e.setRelativeCaption(o)},l)}),this.core.LGel.on(lGEvents.afterSlide+".caption",function(t){var i=t.detail.index;setTimeout(function(){e.core.getSlideItem(i).hasClass("lg-complete")&&e.setRelativeCaption(i)})}),this.core.LGel.on(lGEvents.beforeSlide+".caption",function(t){var i=t.detail.index;setTimeout(function(){e.core.getSlideItem(i).removeClass("lg-show-caption")})}),this.core.LGel.on(lGEvents.containerResize+".caption",function(t){e.setRelativeCaption(e.core.index)}))},e.prototype.setCaptionStyle=function(e,t,i){var o=this.core.getSlideItem(e).find(".lg-relative-caption-item"),l=this.core.getSlideItem(e).find(".lg-sub-html");l.css("width",t.width+"px").css("left",t.left+"px");var n=o.get().getBoundingClientRect(),a=i.bottom-t.bottom-n.height;l.css("top","auto").css("bottom",Math.max(a,0)+"px")},e.prototype.setRelativeCaption=function(e){var t=this.core.getSlideItem(e);if(t.hasClass("lg-current")){var i=this.core.getSlideItem(e).find(".lg-object").get().getBoundingClientRect(),o=this.core.getSlideItem(e).get().getBoundingClientRect();this.setCaptionStyle(e,i,o),t.addClass("lg-show-caption")}},e.prototype.destroy=function(){this.core.LGel.off(".caption")},e}();export default RelativeCaption;