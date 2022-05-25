window.waline_settings = Array();

if(! window.localStorage){
  waline_settings['serverURL']            = "https://waline.17lai.site";
  waline_settings['pageview']             = true ;            
  waline_settings['comment']              = true ;  
  console.log("[waline]使用内部默认值!");
}else{
  //主逻辑业务
  waline_settings['serverURL']            = walineStorage.getItem("serverURL");
  waline_settings['pageview']             = walineStorage.getItem("pageview") === 'true' ? true: false ;            
  waline_settings['comment']              = walineStorage.getItem("comment") === 'true' ? true: false ;  
  console.log("[waline]使用" + waline_settings.serverURL);
}

/**
 * 检测对象是否是空对象(不包含任何可读属性)。
 * 方法只既检测对象本身的属性，不检测从原型继承的属性。 
 * null与undefined区别：
 * 对已声明但未初始化的和未声明的变量执行typeof，都返回 "undefined" 。
 * null表示一个空对象指针，typeof操作会返回 "object" 。*/
function isOwnEmpty(obj) {
  for (var name in obj) {
    if (obj.hasOwnProperty(name)) {
      return false;
    }
  } return true;
}

if (waline_settings.pageview) {
  function upDatePageview() {
    const pvabort = Waline.pageviewCount({
      serverURL: waline_settings.serverURL,
      path: window.location.pathname,
    });
    setTimeout(() => pvabort(), 3000);

    wa_csp = "waline_container_site_pv";
    var ewacsp=document.getElementById(wa_csp);
    //ewacsp.style.display = 'inline';

    wa_cpv = "waline_container_page_pv";
    var ewacpv=document.getElementById(wa_cpv);
    if( isOwnEmpty(ewacpv) != true ){
      console.log("[waline]home page!");
    }else{
      if( isOwnEmpty(ewacpv.style) != true ){
        ewacpv.style.display = 'inline';
        console.log("[waline]update pageview count!");
      }else{
        console.log("[waline]ewacpv.style null!");
      }
    }
  }
  upDatePageview();
}

if (waline_settings.comment) {

  function upDateComment() {
      const cabort = Waline.commentCount({
      serverURL: waline_settings.serverURL,
      path: window.location.pathname,
      });
      
      //alert("事件监听");
      setTimeout(() => cabort(), 2000);

      wa_ccc = "waline_container_comment_count";
      var ewaccc=document.getElementById(wa_ccc);
      ewaccc.style.display = 'inline';

      console.log("[waline]update comment count!");
  }

  function delayUpDateComment() {
    setTimeout(function() { upDateComment(); }, 5000);
    console.log("[waline]delay update comment count!");
  }
  
  var btnsubmit = document.body.getElementsByClassName('wl-btn primary');

  if(typeof btnsubmit[0] != "undefined"){
      if(typeof window.addEventListener != "undefined"){
          // 表示不是IE，支持addEventListener方法
          btnsubmit[0].addEventListener('click',delayUpDateComment,false);
      }else{
          btnsubmit[0].attachEvent("onclick",delayUpDateComment);
      }
      upDateComment();
  }else{
      console.log("[waline]没有开启waline!");
  }
}

