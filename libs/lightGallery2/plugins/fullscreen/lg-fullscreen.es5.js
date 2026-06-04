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
var __assign=function(){return __assign=Object.assign||function(e){for(var l,n=1,t=arguments.length;n<t;n++)for(var c in l=arguments[n])Object.prototype.hasOwnProperty.call(l,c)&&(e[c]=l[c]);return e},__assign.apply(this,arguments)},fullscreenSettings={fullScreen:!0,fullscreenPluginStrings:{toggleFullscreen:"Toggle Fullscreen"}},FullScreen=function(){function e(e,l){return this.core=e,this.$LG=l,this.settings=__assign(__assign({},fullscreenSettings),this.core.settings),this}return e.prototype.init=function(){var e="";if(this.settings.fullScreen){if(!(document.fullscreenEnabled||document.webkitFullscreenEnabled||document.mozFullScreenEnabled||document.msFullscreenEnabled))return;e='<button type="button" aria-label="'+this.settings.fullscreenPluginStrings.toggleFullscreen+'" class="lg-fullscreen lg-icon"></button>',this.core.$toolbar.append(e),this.fullScreen()}},e.prototype.isFullScreen=function(){return document.fullscreenElement||document.mozFullScreenElement||document.webkitFullscreenElement||document.msFullscreenElement},e.prototype.requestFullscreen=function(){var e=document.documentElement;e.requestFullscreen?e.requestFullscreen():e.msRequestFullscreen?e.msRequestFullscreen():e.mozRequestFullScreen?e.mozRequestFullScreen():e.webkitRequestFullscreen&&e.webkitRequestFullscreen()},e.prototype.exitFullscreen=function(){document.exitFullscreen?document.exitFullscreen():document.msExitFullscreen?document.msExitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitExitFullscreen&&document.webkitExitFullscreen()},e.prototype.fullScreen=function(){var e=this;this.$LG(document).on("fullscreenchange.lg.global"+this.core.lgId+" \n            webkitfullscreenchange.lg.global"+this.core.lgId+" \n            mozfullscreenchange.lg.global"+this.core.lgId+" \n            MSFullscreenChange.lg.global"+this.core.lgId,function(){e.core.lgOpened&&e.core.outer.toggleClass("lg-fullscreen-on")}),this.core.outer.find(".lg-fullscreen").first().on("click.lg",function(){e.isFullScreen()?e.exitFullscreen():e.requestFullscreen()})},e.prototype.closeGallery=function(){this.isFullScreen()&&this.exitFullscreen()},e.prototype.destroy=function(){this.$LG(document).off("fullscreenchange.lg.global"+this.core.lgId+" \n            webkitfullscreenchange.lg.global"+this.core.lgId+" \n            mozfullscreenchange.lg.global"+this.core.lgId+" \n            MSFullscreenChange.lg.global"+this.core.lgId)},e}();export default FullScreen;