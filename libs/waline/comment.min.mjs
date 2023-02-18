/**
 * Skipped minification because the original files appears to be already minified.
 * Original file: /npm/@waline/client@2.14.7/dist/comment.mjs
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
const t=t=>{const e=((t="")=>t.replace(/\/$/u,""))(t);return/^(https?:)?\/\//.test(e)?e:`https://${e}`},e=t=>{"AbortError"!==t.name&&console.error(t.message)},n=({serverURL:n,path:r=window.location.pathname,selector:a=".waline-comment-count",lang:o=navigator.language})=>{const s=new AbortController,c=document.querySelectorAll(a);return c.length&&(({serverURL:t,lang:e,paths:n,signal:r})=>fetch(`${t}/comment?type=count&url=${encodeURIComponent(n.join(","))}&lang=${e}`,{signal:r}).then((t=>t.json())).then((t=>Array.isArray(t)?t:[t])))({serverURL:t(n),paths:Array.from(c).map((t=>(t=>{try{t=decodeURI(t)}catch(t){}return t})(t.dataset.path||t.getAttribute("id")||r))),lang:o,signal:s.signal}).then((t=>{c.forEach(((e,n)=>{e.innerText=t[n].toString()}))})).catch(e),s.abort.bind(s)},r="2.14.7";export{n as commentCount,r as version};
//# sourceMappingURL=comment.mjs.map
