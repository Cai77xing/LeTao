;(function () {
  // 1一进入页面,发送ajax请求,请求后台数据,渲染到页面
  var currentPage = 1;
  var pageSize = 2;
  render();
  
  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: 'json',
      success: function (info) {
        $('tbody').html(template('tpl', info));
        
        // 2. 分页操作
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
  
  // 3.点击商品模块显示模态框
  $('.addBtn').on('click', function () {
    $("#addMoal").modal('show');
    // 3.1 发送ajax请求,请求数据渲染到二级分类中
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: 'json',
      success: function (info) {
        // 准备数据
        $('.dropdown-menu').html(template('addTpl', info))
      }
    })
    
    
    // 4.给二级分类添加隐藏域,并让其id地址显示在隐域里面
    $('.dropdown-menu').on('click', '.secondCate', function () {
      $('.second').html($(this).text());
      
      
    })
    
    // 5.点击获取图片地址存在隐藏域里面
    $("#fileupload").fileupload({
      dataType: "json",
      done: function (e, data) {
        // 获取图片的地址放在
        $(".brandLogo").val(data.result.picAddr);
      }
    });
    
    
    // 6.校验模态框
    $("form").bootstrapValidator({
      //  6-1 因为有隐藏域,所以要制定一下
      excluded: [],
      
      //  6-2. 指定校验时的图标显示，默认是bootstrap风格
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      
      //  6-3. 指定校验字段
      fields: {
        //校验用户名，对应name表单的name属性
        proName: {
          validators: {
            //不能为空
            notEmpty: {
              message: '请选择商品名称'
            }
          }
        },
        proDesc: {
          validators: {
            notEmpty: {
              message: '请输入商品描述'
            }
          }
        },
        num: {
          validators: {
            notEmpty: {
              message: '请输入商品库存'
            }
          }
        },
        size: {
          validators: {
            notEmpty: {
              message: '请输入商品尺码'
            }
          }
        },
        oldPrice: {
          validators: {
            notEmpty: {
              message: '请输入商品原价'
            }
          }
        },
        price: {
          validators: {
            notEmpty: {
              message: '请输入商品的现价'
            }
          }
        },
        pic1: {
          validators: {
            notEmpty: {
              message: "请上传3张图片"
            }
          }
        }
        
        
      }
    
    });
    // 7.添加校验事件
    $("#form").on('success.form.bv', function (e) {
      e.preventDefault();
      //使用ajax提交逻辑
      $.ajax({
      
      })
    })
  })
  
  
})()