;(function () {
  var currentPage = 1;
  var pageSize = 5;
  render();
  
  function render() {
    // 1.向后台发送ajax请求,请求数据渲染页面
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        $('tbody').html(template('tpl', info));
        // 2.利用分页插件,事件分页功能
        $(".pagination").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: currentPage,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function (a, b, c, page) {
            currentPage = page;
            render();
          }
        })
      }
      
      
    })
  }
  
  
  // 3.点击添加按钮,弹出模态框
  $(".addBtn").on("click", function () {
    $('#addModal').modal('show');
    // 3.1 向后台发送ajax请求,数据渲染在分类框内
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function (info) {
        $(".dropdown-menu").html(template('tplfirst', info))
      }
      
    })
  })
  
  
  // 4.点击相应的一级分类,让表单内容显示相应的一级分类
  $('.dropdown-menu').on("click", ".cateName", function () {
    $(".firBtn").html($(this).text());
  })
  
  // 5.图片上传
  $('#fileUpload').fileupload({
    dataType: "json",
    done: function (E, data) {
      console.log(data.result.picAddr);
      $(".imgBox").attr("src", data.result.picAddr);
    }
  })
  
})()