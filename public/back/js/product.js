;(function(){
  // 1一进入页面,发送ajax请求,请求后台数据,渲染到页面
  var currentPage = 1;
  var pageSize = 2;
  render();
  function render(){
    $.ajax({
      type:"get",
      url:"/product/queryProductDetailList",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:'json',
      success:function(info){
        console.log(info);
        $('tbody').html(template('tpl',info));
      
        // 2. 分页操作
        $('.pagination').bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage:currentPage,
          totalPages:Math.ceil(info.total/info.size),
          onPageClicked:function(a,b,c,page){
            currentPage=page;
            render();
          }
        })
      }
    })
  }
  
  // 3.点击商品模块显示模态框
  $('.addBtn').on('click',function(){
    $("#addMoal").modal('show');
    // 3.1 发送ajax请求,请求数据渲染到二级分类中
    $.ajax({
      type:"get",
      url:"/category/querySecondCategoryPaging",
      data:{
        page:1,
        pageSize:100
      },
      dataType:'json',
      success:function(info){
        // 准备数据
        $('.dropdown-menu').html(template('addTpl',info))
      }
    })
  
  
    // 4.给二级分类添加隐藏域,并让其id地址显示在隐域里面
    $('.dropdown-menu').on('click','.secondCate',function(){
      $('.second').html($(this).text());
      
      $('.secondId').text()
    })
  })
  
  

  
})()