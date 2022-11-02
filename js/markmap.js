
  const initMarkmap = async () => {
    const debounce = (callback, wait) => {
      let timeout;
      return function (...args) {
          const context = this;
          clearTimeout(timeout);
          timeout = setTimeout(() => callback.apply(context, args), wait);
      };
    }
    const autoFit = (markmaps) => {
      window.addEventListener('resize', () => debounce(Promise.all(markmaps.map(markmap => markmap.fit() )), 100))
    }
    const createMarkmap = () => {
      const markmaps = []
      document.querySelectorAll('.markmap-container>svg').forEach(el => {
        markmaps.push(markmap.Markmap.create(el, {autoFit: true}, JSON.parse(el.getAttribute('data'))))
      })
      autoFit(markmaps)
    }
    if (window.markmap && Object.keys(window.markmap).length != 0) { createMarkmap(); return }
    const CDN = {
      "js": {
        "d3": 'https://fastly.jsdelivr.net/npm/d3@6',
        "markmap_view": 'https://fastly.jsdelivr.net/npm/markmap-view@0.2.7',
      },
      "css": [
        'https://fastly.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css',
        
      ],
    }
    const loadElement = (elname, attr) => {
      const el = document.createElement(elname)
      for (let [name, value] of Object.entries(attr)) {
        el[name] = value
      }
      document.body.appendChild(el);
      return new Promise((res, rej) => {
        el.onload = res
        el.onerror = rej
      })
    }
    const loadScript = (url) => loadElement('script', { 'src': url })
    const loadCSS = (url) => loadElement('link', { 'href': url, 'rel': "stylesheet" })
    const loadStyle = (style) => document.head.insertAdjacentHTML("beforeend", "<style>.markmap-container{display:flex;justify-content:center;margin:0 auto;width:90%;height:500px}.markmap-container svg{width:100%;height:100%}@media(max-width:768px){.markmap-container{height:400px}}</style>")
    loadStyle()
    await loadScript(CDN.js.d3)
    await loadScript(CDN.js.markmap_view)
    await Promise.all(CDN.css.map(loadCSS))

    createMarkmap()
}
if(document.querySelector('.markmap-container')) {
  initMarkmap()
}
