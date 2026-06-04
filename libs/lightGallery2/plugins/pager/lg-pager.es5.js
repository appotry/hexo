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
var __assign=function(){return __assign=Object.assign||function(e){for(var t,r=1,a=arguments.length;r<a;r++)for(var l in t=arguments[r])Object.prototype.hasOwnProperty.call(t,l)&&(e[l]=t[l]);return e},__assign.apply(this,arguments)},lGEvents={afterAppendSlide:"lgAfterAppendSlide",init:"lgInit",hasVideo:"lgHasVideo",containerResize:"lgContainerResize",updateSlides:"lgUpdateSlides",afterAppendSubHtml:"lgAfterAppendSubHtml",beforeOpen:"lgBeforeOpen",afterOpen:"lgAfterOpen",slideItemLoad:"lgSlideItemLoad",beforeSlide:"lgBeforeSlide",afterSlide:"lgAfterSlide",posterClick:"lgPosterClick",dragStart:"lgDragStart",dragMove:"lgDragMove",dragEnd:"lgDragEnd",beforeNextSlide:"lgBeforeNextSlide",beforePrevSlide:"lgBeforePrevSlide",beforeClose:"lgBeforeClose",afterClose:"lgAfterClose",rotateLeft:"lgRotateLeft",rotateRight:"lgRotateRight",flipHorizontal:"lgFlipHorizontal",flipVertical:"lgFlipVertical",autoplay:"lgAutoplay",autoplayStart:"lgAutoplayStart",autoplayStop:"lgAutoplayStop"},pagerSettings={pager:!0},Pager=function(){function e(e,t){return this.core=e,this.$LG=t,this.settings=__assign(__assign({},pagerSettings),this.core.settings),this}return e.prototype.getPagerHtml=function(e){for(var t="",r=0;r<e.length;r++)t+='<span  data-lg-item-id="'+r+'" class="lg-pager-cont"> \n                    <span data-lg-item-id="'+r+'" class="lg-pager"></span>\n                    <div class="lg-pager-thumb-cont"><span class="lg-caret"></span> <img src="'+e[r].thumb+'" /></div>\n                    </span>';return t},e.prototype.init=function(){var e=this;if(this.settings.pager){var t;this.core.$lgComponents.prepend('<div class="lg-pager-outer"></div>');var r=this.core.outer.find(".lg-pager-outer");r.html(this.getPagerHtml(this.core.galleryItems)),r.first().on("click.lg touchend.lg",function(t){var r=e.$LG(t.target);if(r.hasAttribute("data-lg-item-id")){var a=parseInt(r.attr("data-lg-item-id"));e.core.slide(a,!1,!0,!1)}}),r.first().on("mouseover.lg",function(){clearTimeout(t),r.addClass("lg-pager-hover")}),r.first().on("mouseout.lg",function(){t=setTimeout(function(){r.removeClass("lg-pager-hover")})}),this.core.LGel.on(lGEvents.beforeSlide+".pager",function(t){var r=t.detail.index;e.manageActiveClass.call(e,r)}),this.core.LGel.on(lGEvents.updateSlides+".pager",function(){r.empty(),r.html(e.getPagerHtml(e.core.galleryItems)),e.manageActiveClass(e.core.index)})}},e.prototype.manageActiveClass=function(e){var t=this.core.outer.find(".lg-pager-cont");t.removeClass("lg-pager-active"),t.eq(e).addClass("lg-pager-active")},e.prototype.destroy=function(){this.core.outer.find(".lg-pager-outer").remove(),this.core.LGel.off(".lg.pager"),this.core.LGel.off(".pager")},e}();export default Pager;