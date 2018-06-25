// 5. 判断用户是否登录过,进入index页面
if (location.href.indexOf('login.html') === -1){
  $.ajax({
    type: 'get',
    url: '/employee/checkRootLogin',
    dataType: 'json',
    success: function (info) {
      if (info.error === 400) {
        location.href = "login.html";
      }
    }
  })
}

// 1.进度条功能
// 第一个ajax请求开始
$(document).ajaxStart(function () {
  NProgress.start();
});

//所有的ajax请求结束的时候进度条结束
$(document).ajaxStop(function () {
  // 模拟网络延迟,其实是假效果
  setTimeout(function () {
    NProgress.done();
  }, 1000);
  
});


// 2. 侧边栏导航栏切换
;(function () {

// 点击分类,底下的category显示
  $('.aside_nav .cart').on('click', function () {
    $('.aside_nav .carteroy').stop().slideToggle();
  })
  
})();


// 3.移除右边侧边栏
;(function () {
  $(".main_title .icon_meun").on('click', function () {
    $('.lt_index .main').toggleClass('hidemeun');
    $('.lt_index .aside').toggleClass('hidemeun');
    $('.main .main_title').toggleClass('hidemeun');
  })
})();

// 4.点击模态框登出按钮,让后台销毁登入数据
;(function () {
  $('.logoutBtn').on('click', function () {
    $.ajax({
      type: 'get',
      url: '/employee/employeeLogout',
      dataType: 'json',
      success: function (info) {
        // 后台成功销毁数据,回到登录页
        if (info.success) {
          location.href = "login.html";
        }
      }
    })
  })
})()