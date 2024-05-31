/* global Matery, CONFIG */
(function(window, document) {
  for (const each of document.querySelectorAll('[data-lazy-src]')) {
    Matery.utils.waitElementVisible(each, function() {
      var url = each.dataset.lazySrc;
      each.removeAttribute('data-lazy-src');
      var image = new Image();
      image.onload = function () {
        each.classList.add('is-loaded')
        each.style.backgroundImage = 'url(' + url + ')'
      }
      image.src = url
    }, CONFIG.lazyload.offset_factor);
  }

  for (const each of document.querySelectorAll('[bg-lazy]')) {
    Matery.utils.waitElementVisible(each, function() {
      each.removeAttribute('bg-lazy');
    }, CONFIG.lazyload.offset_factor);
  }

  for (const each of document.querySelectorAll('img[lazyload]:not([no-lazy])')) {
    Matery.utils.waitElementVisible(each, function() {
      each.setAttribute("srcset", each.getAttribute("src"));
      each.removeAttribute('srcset');
      // each.removeAttribute('lazyload');
      each.onload = function () {
        //each.style.width="auto";
        //each.style.height="auto";
        each.style.width = this.width + 'px';
        each.style.height = this.height + 'px';
        each.removeAttribute('lazyload');
      }
    }, CONFIG.lazyload.offset_factor);
  }
})(window, document);
