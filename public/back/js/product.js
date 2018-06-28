;(function () {
  // 1一进入页面,发送ajax请求,请求后台数据,渲染到页面
  var currentPage = 1;
  var pageSize = 2;
  // 定义一个数组存放图片地址
  var picArr = [];
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
          size: "mini",
          itemTexts: function (type, page, current,) {
            switch (type) {
              case 'first':
                return "首页";
              case 'prev' :
                return "上一页";
              case 'next' :
                return "下一页";
              case 'last' :
                return "尾页";
              case "page":
                return page;
            }
          },
          tooltipTitles: function (type, page, current) {
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return "前往" + page + "页";
            }
          },
          useBootstrapTooltip: true,
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
        $('.dropdown-menu').html(template('addTpl', info));
        
      }
    })
    
    
    // 4.给二级分类添加隐藏域,并让其id地址显示在隐域里面
    $('.dropdown-menu').on('click', '.secondCate', function () {
      $('.second').html($(this).text());
      var id = $(this).parent().data('id');
      $('[name="brandId"]').val(id);
      // 手动设置校验状态
      $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID");
    })
    
    
    // 5.点击获取图片地址存在隐藏域里面
    $("#fileupload").fileupload({
      dataType: "json",
      done: function (e, data) {
        var picUrl = data.result.picAddr;
        picArr.push(data.result);
        if (picArr.length > 3) {
          // 如果数组的长度大于3,则移除数组的第一项
          picArr.shift();
          // 属性选择器,删除最后一个img标签结构
          $('#imgBox img:last-of-type').remove();
        }
        // 在imgBox里面动态的创建imgbia
        $('#imgBox').prepend('<img src="' + picUrl + '" width="100" height="100">');
        if ( picArr.length === 3 ) {
          $('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID");
        }
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
        brandId: {
          validators: {
            //不能为空
            notEmpty: {
              message: '请选择二级分类'
            }
          }
        },
        proName: {
          validators: {
            //不能为空
            notEmpty: {
              message: '请输入商品名称'
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
        // 要求:要求非0开头的数字
        // * 0次到多次
        num: {
          validators: {
            notEmpty: {
              message: '请输入商品库存'
            },
            regexp: {
              regexp: /^[1-9]\d*$/,
              message: '商品库存必须是非0开头的数字'
            }
          }
        },
        // 尺码校验需求:必须是xx-xx的数字,xx表示数字
        size: {
          validators: {
            notEmpty: {
              message: '请输入商品尺码'
            },
            regexp: {
              regexp: /^\d{2}-\d{2}$/,
              message: '商品尺码格式必须是XX-XX的格式'
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
        picStatus: {
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
      var paramsStr = $('#form').serialize();
      paramsStr += "&picAddr1=" + picArr[0].picAddr + "&picName1=" + picArr[0].picName;
      paramsStr += "&picAddr2=" + picArr[1].picAddr + "&picName2=" + picArr[1].picName;
      paramsStr += "&picAddr3=" + picArr[2].picAddr + "&picName3=" + picArr[2].picName;
      //使用ajax提交逻辑
      $.ajax({
        type: "post",
        url: "/product/addProduct",
        data: paramsStr,
        dataType: 'json',
        success:function(info){
          if(info.success){
     
            // 7-1 隐藏模态框
            $('#addMoal').modal('hide');
            // 7-2 重新渲染页面
            currentPage = 1;
            render();
            // 7-3 重置表单
            $('#form').data("bootstrapValidator").resetForm(true);
  
            $('.second').text("请选择二级分类");
  
            // 手动重置图片, 找到所有图片, 让所有图片自杀
            $('#imgBox img').remove();
          }
        }
        
      })
    })
  })
  
  
})()