!function(f){function k(e,n){return"___"+e.toUpperCase()+n+"___"}Object.defineProperties(f.languages["markup-templating"]={},{buildPlaceholders:{value:function(a,o,e,r){var c;a.language===o&&(c=a.tokenStack=[],a.code=a.code.replace(e,function(e){if("function"==typeof r&&!r(e))return e;for(var n,t=c.length;-1!==a.code.indexOf(n=k(o,t));)++t;return c[t]=e,n}),a.grammar=f.languages.markup)}},tokenizePlaceholders:{value:function(i,l){var p,s;i.language===l&&i.tokenStack&&(i.grammar=f.languages[l],p=0,s=Object.keys(i.tokenStack),function e(n){for(var t=0;t<n.length&&!(p>=s.length);t++){var a,o,r,c,u,g=n[t];"string"==typeof g||g.content&&"string"==typeof g.content?(a=s[p],r=i.tokenStack[a],c="string"==typeof g?g:g.content,a=k(l,a),-1<(u=c.indexOf(a))&&(++p,o=c.substring(0,u),r=new f.Token(l,f.tokenize(r,i.grammar),"language-"+l,r),c=c.substring(u+a.length),u=[],o&&u.push.apply(u,e([o])),u.push(r),c&&u.push.apply(u,e([c])),"string"==typeof g?n.splice.apply(n,[t,1].concat(u)):g.content=u)):g.content&&e(g.content)}return n}(i.tokens))}}})}(Prism);