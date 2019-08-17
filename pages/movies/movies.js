// pages/movies/movies.js
var app = getApp();
var util = require("../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  // 最好是一个初始值，是一个对象的话就传输一个空对象
  // 获得电影数据的方法是异步的， 只有异步方法全部完成，才能将数据全部定义给data,在标签中获取data里面的movies的数据(属性)时，无法获取,可以先给movies的三个属性一个初始值
  data: {
    inTheaters: {},
    comingSoonUrl: {},
    top250: {},
    // 电影页面的显示与否
    containerShow: true,
    // 搜索页面的显示与否
    searchPanelShow: false,
    searchResult: {},
  },
  // 跳转电影详情事件
  onMovieTap: function (event) {
    // 记住 自定义属性名会被自动转化为小写
    var movieId = event.currentTarget.dataset.movieid
    wx.navigateTo({
      url: './movie-detail/movie-detail?id=' + movieId,
    })
  },
  onLoad: function(options) {
    //定义请求url
    var inTheaters = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + '?start=0&count=3';
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + '?start=0&count=3';
    this.getMovieListData(inTheaters, "inTheaters", "正在热映");
    this.getMovieListData(comingSoonUrl, 'comingSoonUrl', "即将上映");
    this.getMovieListData(top250Url, 'top250Url', "Top250");
  },
  // 搜索聚焦事件
  onBindFocus: function(event) {
    this.setData({
      // 电影页面的显示与否
      containerShow: false,
      // 搜索页面的显示与否
      searchPanelShow: true
    })
  },
  // 搜索事件
  onBindBlur: function(event) {

    if (event.detail.value == '') {
      // 表示退出搜索页面
      this.setData({

        containerShow: true,
        searchPanelShow: false,
        searchResult: {}

      })
      // 用户选择搜索
    } else {
      // 定义搜索url
      // 获取文本框输入的文本
      var text = event.detail.value;
      // 拼接url
      var searchUrl = app.globalData.doubanBase + '/v2/movie/search?=' + text;
      this.getMovieListData(searchUrl, "searchResult", '');
      this.setData({
        searchResult: {}
      })
    }
  },
  // 取消搜索的事件
  onCancelImgTap: function(event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {}
    })
    if (event.detail.value != '') {
      //将文本框清空
    }
  },
  // 更多点击事件
  onMoreTap: function(event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: '/pages/movies/more-movie/more-movie?category=' + category,
    })
  },
  // 获取电影数据并改变data值
  getMovieListData: function(url, settedKey, categoryTitle) {
    var that = this;

    // 微信小程序发送请求
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": 'json'
      },
      success: function(res) {
        that.processDoubanData(res.data, settedKey, categoryTitle);
      },
      fail: function(error) {

      }
    })
  },
  // 对api传来的数据进行选择并格式化
  processDoubanData: function(moviesDouban, settedKey, catetoryTitle) {
    // 创建一个数组
    var movies = [];
    var categoryTitle = catetoryTitle;
    // 循环subject属性
    for (let index in moviesDouban.subjects) {
      let subject = moviesDouban.subjects[index];
      var title = subject.original_title;
      // 标题如果大于6位 则自动转换成...
      if (title.length > 6) {
        title = title.slice(0, 6) + '...';
      }
      var average = subject.rating.average;
      var coverageUrl = subject.images.large;
      var movieId = subject.id;
      var stars = util.convertToStarsArray(subject.rating.stars);
      var temp = {
        stars,
        title,
        average,
        coverageUrl,
        movieId,
      }
      movies.push(temp);
    }
    var readyData = {};
    // 动态属性赋值
    readyData[settedKey] = {
      movies: movies,
      categoryTitle,
    }
    this.setData(readyData);
  },
})