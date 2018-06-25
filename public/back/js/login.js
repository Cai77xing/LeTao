
$(function(){
  // 1.登录校验
  $("#form").bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok', // 检验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      username:{
        validators:{
          notEmpty:{
            message:"用户名不能为空"
          },
          stringLength:{
            min:2,
            max:6,
            message:"用户名长度必须在2-6位"
          },
          callback:{
            message:"用户名不存在"
          }
        }
      },
      password: {
        validators:{
          notEmpty:{
            message:"密码不能为空"
          },
          stringLength:{
            min:6,
            max:12,
            message:"密码长度必须在6-12位"
          },
          callback:{
            message:"密码错误"
          }
        }
      }
    }
    
  });
  /*
  * 2.需要注册表单校验成功事件,阻止默认的表单提交
  * */
  $('#form').on("success.form.bv",function(e){
    e.preventDefault();
    
    $.ajax({
      type:'post',
      url:'/employee/employeeLogin',
      data:$('#form').serialize(),
      dataType:"json",
      success:function(info){
        //通过info.error的错误码,判断是用户名还是密码错误
        if(info.error===1000){
          // alert('用户名不存在');
          $('#form').data('bootstrapValidator').updateStatus('username',"INVALID",'callback');
        }
        if(info.error === 1001){
          // alert('密码错误');
          $('#form').data('bootstrapValidator').updateStatus('password',"INVALID",'callback');
        }
        if(info.success){
          location.href = "index.html";
        }
      }
    })

  });
  
  // 3.表单重置
  // $('input[type="reset"]')
  $('[type="reset"]').on('click',function(){
    $("#form").data("bootstrapValidator").resetForm();
  })
});