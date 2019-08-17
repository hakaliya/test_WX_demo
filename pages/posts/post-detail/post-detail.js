// pages/posts/post-detail/post-detail.js
// 引入data文件
var postData = require("../../../data/post-data.js");
var app = getApp();


Page({
      /**
       * 页面的初始数据
       */

      data: {
        isPlayingMusic: false
      },
      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function(options) {
        console.log(app.globalData.g_isPlayingMusic)
        var globalData = app.globalData;
        var postId = options.id;
        // 使得postId在其他函数也可以被使用
        this.setData({
          currentPostId: postId
        })
        var postsData = postData.post_List[postId];
        this.setData({
          postsData
        });

        // 读取缓存(若是第一次访问，则无缓存，得出undefined)
        var postsCollected = wx.getStorageSync('posts_collected');

        if (postsCollected) {
          // 读取本文收藏状态
          var postCollected = postsCollected[postId];
          // 绑定collected变量
          this.setData({
            collected: postCollected
          })

        } // 第一次浏览,未缓存状态
        else {
          // 创建对象postsCollected
          var postsCollected = {};
          postsCollected[postId] = false;
          // 更新缓存
          wx.setStorageSync('posts_collected', postsCollected);
          // 更新数据绑定
          this.setData({
            collected: postsCollected[postId]
          })

        }
        // 音乐播放状态以及播放的是哪个音乐
        // 如果正在播放
        if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
          this.setData({
            isPlayingMusic: true
          })
        } 
        this.setMusicMonitor();

      },
      // 音乐监听函数
      setMusicMonitor: function() {
        var that = this;
        // 监听音乐播放
        // 回调函数里面使用that
        // this指的是函数运行的上下文环境 不使用that的话this指针指向function回调函数 在function种没有setData方法
        wx.onBackgroundAudioPlay(function() {
          console.log("音乐开始播放");
          // 即时修改图片状态
          that.setData({
            isPlayingMusic: true
          })
          // 修改全局变量
          app.globalData.g_isPlayingMusic = true;
          // 记录当前播放的是哪个音乐
          app.globalData.g_currentMusicPostId = that.data.currentPostId;

        })
        // 音乐不能控制进度
        // 只能到后台关闭或者移到最上方手动关闭
        // 

        wx.onBackgroundAudioPause(function() {
          console.log("音乐暂停");
          that.setData({
            isPlayingMusic: false
          })
          app.globalData.g_isPlayingMusic = false;
          // 将当前播放音乐清空
          app.g_currentMusicPostId =  null;

        })
        // 音乐放完以后自动停止 状态改变
        wx.onBackgroundAudioStop(function () {
          console.log("音乐暂停");
          that.setData({
            isPlayingMusic: false
          })
          app.globalData.g_isPlayingMusic = false;
          // 将当前播放音乐清空
          app.g_currentMusicPostId = null;

        })

      },

      // 收藏点击函数（异步）
      onCollectionTapAsyc() {
        var that = this;
        wx.getStorage({
          key: 'posts_collected',
          success: function(res) {
            // res.data就是异步得到的数据
            var postsCollected = res.data;
            var postCollected = postsCollected[that.data.currentPostId];
            console.log(postCollected)
            that.showModal(postsCollected, postCollected);
          },
        })


      },

      // 收藏点击函数(同步)
      onCollectionTap: function(event) {

        // 获取缓存
        var postsCollected = wx.getStorageSync('posts_collected');
        // 获取该文章收藏状态
        var postCollected = postsCollected[this.data.currentPostId];

        this.showModal(postsCollected, postCollected);
      },


      showModal: function(postsCollected, postCollected) {
        // this值的是函数执行的上下文环境

        var that = this;
        wx.showModal({
          title: postCollected ? '是否取消收藏' : '是否收藏',
          content: '请确认您的选择',
          confirmText: '确定',
          cancelText: '取消',
          confirmColor: '#666',
          cancelColor: "#405080",
          success: function(res) {
            // 如果用户点击确定
            if (res.confirm) {
              //将状态取反
              postCollected = !postCollected;

              // 更新状态
              postsCollected[that.data.currentPostId] = postCollected;
              // 更新缓存
              wx.setStorageSync('posts_collected', postsCollected);
              // 更改数据绑定
              // 这里如果用this，代表的是success函数。
              that.setData({
                collected: postCollected
              })
              // 如果用户点击取消s
            } else {
              return;
            }
          }

        })


      },

      onMusic: function(event) {
        // 获取id号
        var currentPostId = this.data.currentPostId;
        // 获取音乐播放状态
        // 如果正播放
        if (app.globalData.g_isPlayingMusic) {
          wx.pauseBackgroundAudio();
          // 修改图片状态
          this.setData({
            isPlayingMusic: false
          })
          // 变成暂停状态
          app.globalData.g_isPlayingMusic = false

        } else {

          wx.playBackgroundAudio({
            dataUrl: postData.post_List[currentPostId].music.dataUrl,
            coverImgUrl: postData.post_List[currentPostId].music.coverImgUrl,
            title: postData.post_List[currentPostId].music.title
          })
          this.setData({
            isPlayingMusic: true
          })

          // 修改全局变量
          app.globalData.g_isPlayingMusic = true
        }

         },
        // 分享函数
        onShareTap: (event) => {
            // 微信小程序暂不支持分享
            wx.showActionSheet({
              itemList: ["微信好友", "朋友圈", "QQ好友", "QQ空间"],
              itemColor: "#405f80",
            })

          },

          /**
           * 生命周期函数--监听页面初次渲染完成
           */
          onReady: function() {

          },

          /**
           * 生命周期函数--监听页面显示
           */
          onShow: function() {

          },

          /**
           * 生命周期函数--监听页面隐藏
           */
          onHide: function() {

          },

          /**
           * 生命周期函数--监听页面卸载
           */
          onUnload: function() {

          },

          /**
           * 页面相关事件处理函数--监听用户下拉动作
           */
          onPullDownRefresh: function() {

          },

          /**
           * 页面上拉触底事件的处理函数
           */
          onReachBottom: function() {

          },

          /**
           * 用户点击右上角分享
           */
          onShareAppMessage: function() {

          }
      })