App({
  // 定义一个全局变量，使得页面隐藏时改变，且在另一个页面打开的时候，不会因为页面加载而使私有变量变成false
  globalData: {
    g_isPlayingMusic: false,
    // 确保起初是false
    g_currentMusicPostId : null,
    // 区分哪一个音乐正在被播放
    doubanBase : 'http://t.yushu.im'
    // 豆瓣api基地址
  },
  

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
