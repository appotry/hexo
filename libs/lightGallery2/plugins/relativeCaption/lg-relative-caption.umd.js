/*!
 * lightgallery | 2.7.2 | September 20th 2023
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).lgRelativeCaption=e()}(this,function(){"use strict";
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
    ***************************************************************************** */var t=function(){return t=Object.assign||function(t){for(var e,i=1,o=arguments.length;i<o;i++)for(var n in e=arguments[i])Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t},t.apply(this,arguments)},e="lgContainerResize",i="lgSlideItemLoad",o="lgBeforeSlide",n="lgAfterSlide",s={relativeCaption:!1};return function(){function l(e){this.core=e;var i={addClass:this.core.settings.addClass+" lg-relative-caption"};return this.core.settings=t(t({},this.core.settings),i),this.settings=t(t(t({},s),this.core.settings),i),this}return l.prototype.init=function(){var t=this;this.settings.relativeCaption&&(this.core.LGel.on(i+".caption",function(e){var i=e.detail,o=i.index,n=i.delay;setTimeout(function(){o===t.core.index&&t.setRelativeCaption(o)},n)}),this.core.LGel.on(n+".caption",function(e){var i=e.detail.index;setTimeout(function(){t.core.getSlideItem(i).hasClass("lg-complete")&&t.setRelativeCaption(i)})}),this.core.LGel.on(o+".caption",function(e){var i=e.detail.index;setTimeout(function(){t.core.getSlideItem(i).removeClass("lg-show-caption")})}),this.core.LGel.on(e+".caption",function(e){t.setRelativeCaption(t.core.index)}))},l.prototype.setCaptionStyle=function(t,e,i){var o=this.core.getSlideItem(t).find(".lg-relative-caption-item"),n=this.core.getSlideItem(t).find(".lg-sub-html");n.css("width",e.width+"px").css("left",e.left+"px");var s=o.get().getBoundingClientRect(),l=i.bottom-e.bottom-s.height;n.css("top","auto").css("bottom",Math.max(l,0)+"px")},l.prototype.setRelativeCaption=function(t){var e=this.core.getSlideItem(t);if(e.hasClass("lg-current")){var i=this.core.getSlideItem(t).find(".lg-object").get().getBoundingClientRect(),o=this.core.getSlideItem(t).get().getBoundingClientRect();this.setCaptionStyle(t,i,o),e.addClass("lg-show-caption")}},l.prototype.destroy=function(){this.core.LGel.off(".caption")},l}()});