onIsOff=!0,window.callback=function(t){0===t.ret&&window.clearInterval(t2),2===t.ret&&(onIsOff=!0)};var t2=window.setInterval(function(){1==onIsOff&&(act=document.activeElement.id,"veditor"==act&&(document.getElementById("TencentCaptcha").click(),onIsOff=!1))},1e3);