// $(function () {
$(document).ready(function(){
  var scrollHandler = throttle(lazyLoadImages, 200)

  function throttle(func) {
    var wait = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];

    var timer = null;
    return function () {
      var _this = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (timer === null) {
        timer = setTimeout(function () {
          func.apply(_this, args);
          timer = null;
        }, wait);
      }
    };
  }

  function isInViewport(elem, threshold) {
    threshold = threshold || 0
    var bounding = elem.getBoundingClientRect();
    return (
      bounding.top >= -threshold &&
      bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) + threshold
    );
  }

  function lazyLoadImages() {
    var lazyImages = document.querySelectorAll('[data-lazy-src]')

    // if (lazyImages.length == 0) {
    //   window.removeEventListener('scroll', scrollHandler)
    //   return
    // }

    lazyImages.forEach(function (img) {
      if (!isInViewport(img, 500)) { return }

      var url = img.dataset.lazySrc
      img.removeAttribute('data-lazy-src')

      var image = new Image()
      image.onload = function () {
        img.classList.add('is-loaded')
        img.style.backgroundImage = 'url(' + url + ')'
      }
      image.src = url
    })

    // css图片
    var lazyBackgrounds = [].slice.call(document.querySelectorAll(".lazy-background"));
    
    if ("IntersectionObserver" in window) {
        let lazyBackgroundObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            lazyBackgroundObserver.unobserve(entry.target);
            }
        });
        });
    
        lazyBackgrounds.forEach(function(lazyBackground) {
        lazyBackgroundObserver.observe(lazyBackground);
        });
    }

    if ( lazyImages.length == 0 && lazyBackgrounds.length == 0 ) {
      window.removeEventListener('scroll', scrollHandler)
      return
    }

  }

  window.addEventListener('scroll', scrollHandler);
  lazyLoadImages();

});
