!function(){var l,y,b,v,t,A,r;function P(e,t){return Array.prototype.slice.call((t||document).querySelectorAll(e))}function E(e,t){return e.classList.contains(t)}function C(e){e()}function o(e){return!!(e&&/pre/i.test(e.nodeName)&&(e.hasAttribute("data-line")||e.id&&Prism.util.isActive(e,y)))}function s(){var e=location.hash.slice(1),t=(P(".temporary.line-highlight").forEach(function(e){e.parentNode.removeChild(e)}),(e.match(/\.([\d,-]+)$/)||[,""])[1]);t&&!document.getElementById(e)&&(e=e.slice(0,e.lastIndexOf(".")),e=document.getElementById(e))&&(e.hasAttribute("data-line")||e.setAttribute("data-line",""),Prism.plugins.lineHighlight.highlightLines(e,t,"temporary ")(),A)&&document.querySelector(".temporary.line-highlight").scrollIntoView()}"undefined"!=typeof Prism&&"undefined"!=typeof document&&document.querySelector&&(l="line-numbers",y="linkable-line-numbers",b=/\n(?!$)/g,v=function(){var e;return void 0===t&&((e=document.createElement("div")).style.fontSize="13px",e.style.lineHeight="1.5",e.style.padding="0",e.style.border="0",e.innerHTML="&nbsp;<br />&nbsp;",document.body.appendChild(e),t=38===e.offsetHeight,document.body.removeChild(e)),t},A=!0,Prism.plugins.lineHighlight={highlightLines:function(u,e,a){var t,e=(e="string"==typeof e?e:u.getAttribute("data-line")||"").replace(/\s+/g,"").split(",").filter(Boolean),h=+u.getAttribute("data-line-offset")||0,c=(v()?parseInt:parseFloat)(getComputedStyle(u).lineHeight),d=Prism.util.isActive(u,l),i=u.querySelector("code"),p=!d&&i||u,g=[],n=i.textContent.match(b),m=n?n.length+1:1,f=i&&p!=i?(n=u,i=i,n=getComputedStyle(u),t=getComputedStyle(i),i.offsetTop+r(t.borderTopWidth)+r(t.paddingTop)-r(n.paddingTop)):0;function r(e){return+e.substr(0,e.length-2)}e.forEach(function(e){var t,i,n,r,o=e.split("-"),s=+o[0],l=+o[1]||s;(l=Math.min(m+h,l))<s||(t=u.querySelector('.line-highlight[data-range="'+e+'"]')||document.createElement("div"),g.push(function(){t.setAttribute("aria-hidden","true"),t.setAttribute("data-range",e),t.className=(a||"")+" line-highlight"}),d&&Prism.plugins.lineNumbers?(o=Prism.plugins.lineNumbers.getLine(u,s),i=Prism.plugins.lineNumbers.getLine(u,l),o&&(n=o.offsetTop+f+"px",g.push(function(){t.style.top=n})),i&&(r=i.offsetTop-o.offsetTop+i.offsetHeight+"px",g.push(function(){t.style.height=r}))):g.push(function(){t.setAttribute("data-start",String(s)),s<l&&t.setAttribute("data-end",String(l)),t.style.top=(s-h-1)*c+f+"px",t.textContent=new Array(l-s+2).join(" \n")}),g.push(function(){t.style.width=u.scrollWidth+"px"}),g.push(function(){p.appendChild(t)}))});var o,s=u.id;return d&&Prism.util.isActive(u,y)&&s&&(E(u,y)||g.push(function(){u.classList.add(y)}),o=parseInt(u.getAttribute("data-start")||"1"),P(".line-numbers-rows > span",u).forEach(function(e,t){var i=t+o;e.onclick=function(){A=!1,location.hash=s+"."+i,setTimeout(function(){A=!0},1)}})),function(){g.forEach(C)}}},r=0,Prism.hooks.add("before-sanity-check",function(e){var t,i=e.element.parentElement;o(i)&&(t=0,P(".line-highlight",i).forEach(function(e){t+=e.textContent.length,e.parentNode.removeChild(e)}),t)&&/^(?: \n)+$/.test(e.code.slice(-t))&&(e.code=e.code.slice(0,-t))}),Prism.hooks.add("complete",function e(t){var i,n=t.element.parentElement;o(n)&&(clearTimeout(r),i=Prism.plugins.lineNumbers,t=t.plugins&&t.plugins.lineNumbers,E(n,l)&&i&&!t?Prism.hooks.add("line-numbers",e):(Prism.plugins.lineHighlight.highlightLines(n)(),r=setTimeout(s,1)))}),window.addEventListener("hashchange",s),window.addEventListener("resize",function(){P("pre").filter(o).map(function(e){return Prism.plugins.lineHighlight.highlightLines(e)}).forEach(C)}))}();