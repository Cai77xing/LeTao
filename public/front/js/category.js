;(function(){
  
  // 1.动态渲染左边的ul
  $.ajax({
    type:"get",
    url:"/category/queryTopCategory",
    dataType:"json",
    success:function(info){
      $(".cateLeft").html(template('tplLeft',info));
      
      // 一开始让页面渲染第一个耳机分类
      getSecond(info.rows[0].id);
    }
  })
  
  // 2.点击相应的li切换相应的current类,使用事件委托

  $(".cateLeft").on('click','.secondCate',function(){
     $(this).addClass('current').parent().siblings().find("a").removeClass('current');
     var id = $(this).data('id');
     getSecond(id);
     // 发送ajax请求,获取数据,显然页面
  
  })
  function getSecond(id){
    $.ajax({
      type:'get',
      url:'/category/querySecondCategory',
      data:{id :id},
      dataType:"json",
      success:function(info){
        console.log(info);
        // 获取数据渲染页面
        $('.infoCate').html(template('infoTpl',info));
      }
    })
  }
})()
