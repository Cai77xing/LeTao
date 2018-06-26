;(function(){
  // 一进入页面就进行ajax请求
  $.ajax({
    type:'get',
    url:'/user/queryUser',
    data:{
      page:1,
      pageSize:5
    },
    dataType:'json',
    success:function(info){
      console.log(info);
      $('tbody').html(template('tmp',info));
      
      // 分页插件
    }
  })
})()