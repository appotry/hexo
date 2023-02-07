// 代码块全部显示

$(function () {
// $(document).ready(function(){
  var $code_full = $('<div class="scroll-down-bar"><i class="fas fa-angle-down" ></i></div>');

  $('.code-area').prepend($code_full);
  $('.code-area pre').each(function (index, value) {
    //console.log($(this).height());
    if ($(this).height() >= 405 ) {
      //console.log("add show code-full" + index + ': ' + value );
      // $(this).parent().prepend($code_full);
      // $('.code-area')[index].prepend($code_full);
      $(this).parent().addClass('show-code-full');
      AOS.refresh(); //高度改变 刷新视图
      progressBarInit();
      //Matery.utils.retry(function() {
      //  if (Matery.boot && Matery.boot.refresh) {
      //    Matery.boot.refresh();
      //    return true;
      //  }
      //}, 100, 10);
    }
  });

  $('.code-area .scroll-down-bar').on('click', function () {
    if ($(this).parent().hasClass('code-full')) {
      // $(this).siblings('pre').find('code').show();
      $(this).parent().removeClass('code-full');
    } else {
      // $(this).siblings('pre').find('code').hide();
      $(this).parent().addClass('code-full');
    }
    AOS.refresh(); //高度改变 刷新视图
    progressBarInit();
    //Matery.utils.retry(function() {
    //  if (Matery.boot && Matery.boot.refresh) {
    //    Matery.boot.refresh();
    //    return true;
    //  }
    //}, 100, 10);
  });
});
