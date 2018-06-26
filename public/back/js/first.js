;(function () {
  // 2.已进入页面,ajax请求,向后台请求数据,渲染到页面
  var currentPage = 1;
  var pageSize = 2;
  render();
  
  function render() {
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function (info) {
        // 准备数据
        $('tbody').html(template('tpl', info));
        
        // 准备分页插件
        $('.pagination').bootstrapPaginator({
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
  
  // 3. 点击分类按钮,弹出模态框
  $(".addCart").on('click', function () {
    $('#addModal').modal('show');
  })
  
  // 4.通过表单校验插件,实现表单校验功能
  $("#form").bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',   // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },
    fields: {
      // cateName校验
      cateName: {
        validators: {
          // 非空校验
          notEmpty: {
            message: '一级分类名不能为空'
          },
        }
      }
    }
  })
  
  // 5.注册表单注册成功事件,阻止表单的默认行为,进行ajax请求
  $("#form").on('success.form.bv',function(e){
    e.preventDefault();
    $.ajax({
      type:"post",
      url:"/category/addTopCategory",
      // 注意类名,要与之前的一致
      data:$("#form").serialize(),
      dataType:"json",
      success:function(info){
        if(info.success){
          // 5-2.关闭模态框
          $('#addModal').modal('hide');
          currentPage = 1;
          render();
          // 5-3 重置模态框
          $("#form").data('bootstrapValidator').resetForm(true);
        }
      }
    })
    
  })
  
})()