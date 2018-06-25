
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