// pages/posts/posts.js
var post_data = require("../../data/post-data.js");

Page({

  onPostDetail: (event) => {
    var postid = event.currentTarget.dataset.postid;
    console.log(postid);
    
    wx.navigateTo(
      {    
      url: "/pages/posts/post-detail/post-detail?id=" + postid,
    })
  },
  // 点击轮播图的跳转
  onSwiperTap : (event) =>{
    // currentTarget 指的是swiper组件
    // target 指的是当前点击的组件
    // 获取postId
    var postid = event.target.dataset.postid;
    wx.navigateTo({
      url: '/pages/posts/post-detail/post-detail?id=' + postid,
    })

  },
  
  /**
   * 页面的初始数据
   */
  data: {
    date : 'Nov 18 20 2019',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("1")
   
    this.setData({ 
      post_key : post_data.post_List
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("3")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("2")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("4")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("5")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("用户正在下拉")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("用户上拉触底")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log("用户点击分享")
  }
})