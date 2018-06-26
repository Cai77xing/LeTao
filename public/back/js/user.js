;(function () {
  // 2 一进入页面的时候先调用一次
  var idBtn = 0;
  var currentPage = 1;
  var pageSize = 5;
  render();
  // 1 一进入页面就进行ajax请求
  function render() {
    $.ajax({
      type: 'get',
      url: '/user/queryUser',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: 'json',
      success: function (info) {
        $('tbody').html(template('tmp', info));
        
        // 分页插件
        $(".pagination").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: currentPage,
          totalPages: Math.ceil(info.total / info.size),
          // 为每个按钮设置点击事件
          onPageClicked: function (a, b, c, page) {
            // page:当前点值的按钮,重新渲染当前页
            currentPage = page;
            render();
          }
        })
      }
    })
  }
  
  // 3 点击按钮,显示模态框,注意使用事件委托
  $('tbody').on('click','.btn',function(){
    $("#btnModal").modal('show');
    // 定义一个全局变量
     idBtn = $(this).parent().data('id');
     var isDelte = $(this).hasClass('btn-danger')?0:1;
  
    // 点击模态框确定按钮
    $('.confirmBtn').on('click',function(){
       // 发送ajax请求,让模态框隐藏
      $("#btnModal").modal('hide');
      $.ajax({
        type:"post",
        url:"/user/updateUser",
        data:{
          id:idBtn,
          isDelete:isDelte
        },
        success:function(info){
          if(info.success){
            render();
          }
        }
      })
      
    })
  })
})()