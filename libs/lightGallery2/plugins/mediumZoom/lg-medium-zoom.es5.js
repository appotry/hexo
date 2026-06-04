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
var __assign=function(){return __assign=Object.assign||function(e){for(var t,o=1,i=arguments.length;o<i;o++)for(var r in t=arguments[o])Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e},__assign.apply(this,arguments)},lGEvents={afterAppendSlide:"lgAfterAppendSlide",init:"lgInit",hasVideo:"lgHasVideo",containerResize:"lgContainerResize",updateSlides:"lgUpdateSlides",afterAppendSubHtml:"lgAfterAppendSubHtml",beforeOpen:"lgBeforeOpen",afterOpen:"lgAfterOpen",slideItemLoad:"lgSlideItemLoad",beforeSlide:"lgBeforeSlide",afterSlide:"lgAfterSlide",posterClick:"lgPosterClick",dragStart:"lgDragStart",dragMove:"lgDragMove",dragEnd:"lgDragEnd",beforeNextSlide:"lgBeforeNextSlide",beforePrevSlide:"lgBeforePrevSlide",beforeClose:"lgBeforeClose",afterClose:"lgAfterClose",rotateLeft:"lgRotateLeft",rotateRight:"lgRotateRight",flipHorizontal:"lgFlipHorizontal",flipVertical:"lgFlipVertical",autoplay:"lgAutoplay",autoplayStart:"lgAutoplayStart",autoplayStop:"lgAutoplayStop"},mediumZoomSettings={margin:40,mediumZoom:!0,backgroundColor:"#000"},MediumZoom=function(){function e(e,t){var o=this;this.core=e,this.$LG=t,this.core.getMediaContainerPosition=function(){return{top:o.settings.margin,bottom:o.settings.margin}};var i={controls:!1,download:!1,counter:!1,showCloseIcon:!1,extraProps:["lgBackgroundColor"],closeOnTap:!1,enableSwipe:!1,enableDrag:!1,swipeToClose:!1,addClass:this.core.settings.addClass+" lg-medium-zoom"};return this.core.settings=__assign(__assign({},this.core.settings),i),this.settings=__assign(__assign(__assign({},mediumZoomSettings),this.core.settings),i),this}return e.prototype.toggleItemClass=function(){for(var e=0;e<this.core.items.length;e++){this.$LG(this.core.items[e]).toggleClass("lg-medium-zoom-item")}},e.prototype.init=function(){var e=this;this.settings.mediumZoom&&(this.core.LGel.on(lGEvents.beforeOpen+".medium",function(){e.core.$backdrop.css("background-color",e.core.galleryItems[e.core.index].lgBackgroundColor||e.settings.backgroundColor)}),this.toggleItemClass(),this.core.outer.on("click.lg.medium",function(){e.core.closeGallery()}))},e.prototype.destroy=function(){this.toggleItemClass()},e}();export default MediumZoom;