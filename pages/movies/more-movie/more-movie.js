// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require("../../../utils/util.js");
Page({
  data: {
    movies: {},
    navigateTitle: '',
    requestUrl: '',
    totalCount: 0,
    //表示movies是否为空
    isEmpty: true
  },
  onMovieTap: function (event) {
    // 记住 自定义属性名会被自动转化为小写
    var movieId = event.currentTarget.dataset.movieid
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId,
    })
  },
  onLoad: function(options) {
    var that = this;
    var category = options.category;
    
    this.setData({
      navigateTitle: category
    })
    switch (category) {
      case "正在热映":
        var dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        var dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "Top250":
        var dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    this.setData({
      requestUrl: dataUrl
    })
    
    util.http(dataUrl, function(data) {
      that.processDoubanData(data);
    });
    
  },
  onScrollLower: function (event) {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + '&count=20';
    util.http(nextUrl,this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  processDoubanData: function(moviesDouban) {
    // 创建一个数组
    var movies = [];
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
    var totalMovies = {};
    this.data.totalCount += 20; 
    // 不是第一次加载数据 要使将要加载的二十条和已知的20条数据合并 而并不是替代
    if (!this.data.isEmpty) {
      //
      totalMovies = this.data.movies.concat(movies);
    // 如果是空的
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
        movies: totalMovies
    })
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  onPullDownRefresh: function (){
    var refreshUrl = requestUrl+ '?start=0' + 'count=20';
    util.http(refreshUrl,this.processDoubanData );
    this.data.isEmpty = {};
    this.data.totalCount = 0;
    wx.showNavigationBarLoading();
  },
  onReady: function(event) {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
  }
})