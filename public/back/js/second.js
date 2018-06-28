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
    var id = $(this).data('id');
   $('[name="categoryId"]').val(id);
   
   // 手动改变form表单的状态
    $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID")
  })
  
  // 5.图片上传
  $('#fileUpload').fileupload({
    dataType: "json",
    done: function (E, data) {
      $(".imgBox").attr("" +
        "", data.result.picAddr);
      $('[name="brandLogo"]').val(data.result.picAddr);
      $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
   
  })
  
  
  // 6.表单验证
  $('#form').bootstrapValidator({
    // 表单校验.默认情况下不会校验隐藏的表单,所以需要设置一下
    excluded: [],
  
    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',   // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },
  
    // 配置字段
    fields: {
      //categoryId 用户选择一级分类 id
      //brandName  用户输入二级分类名称
      //brandLogo  上传的图片地址
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: "请输入二级分类名称"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传图片"
          }
        }
      }
    }
  });
  
  // 7.阻止表单默认提交
  $('#form').on("success.form.bv", function( e ) {
    e.preventDefault();
    
    $.ajax({
      type:"post",
      url:'/category/addSecondCategory',
      data:$('#form').serialize(),
      dataType:'json',
      success:function(info){
        if(info.success){
          // 1.关闭模态框
          $('#addModal').modal('hide');
          // 2.重置表单
          $('#form').data("bootstrapValidator").resetForm(true);
          // 3.渲染页面,重新渲染第一页
          currentPage=1;
          render();
          // 由于下拉框和图片不是表单, 所以需要手动重置
          $('#dropdownTxt').text("请选择一级分类");
          $('#imgBox img').attr("src", "images/none.png");
          
        }
      }
      
    })
    
  })
})()