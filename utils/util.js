// 用来存放公共方法

// 星星评分方法
function convertToStarsArray(stars) {
  var array = []
  // 如果是整十数
  if (stars % 10 == 0) {
    var ten_digits = stars / 10;
    for (let i = 0; i < ten_digits; i++) {
      array.push(1)
    }
    for (let i = 0; i < 5 - ten_digits; i++) {
      array.push(0)
    }
  } else {
    // 获取个位数
    var single_digit = stars % 10;  //2
    // 获取十位数
    var ten_digits = stars / 10 - single_digit * 0.1; //4

    for (let i = 0; i < ten_digits; i++) {
      array.push(1)
    }

    if (single_digit = 5) {
      array.push(2)
    } else if (single_digit > 5) {
      array.push(1)
    } else {
      array.push(0)
    }
    if (array.length < 5) {
      for (let i = 0; i < 5 - array.length; i++) {
        array.push(0)
      }
    }
  }
  return(array)
}

function http(url, callBack) {
  wx.request({
    url: url,
    method: 'GET',
    header: {
      "Content-Type": ""
    },
    success: function (res) {
      callBack(res.data)
    },
    fail: function (error) {
      console.log(error)
    }
  })

}

function convertToCastString (casts) {
  var castsjoin = '';
  for (var idx in casts) {
    castsjoin = castsjoin + casts[idx].name + '/';
  }
  return castsjoin.substring(0, castsjoin.length -2);
}

function convertToCastInfos(casts) {
  var array = [];
  for (var idx in casts ) {
    var cast = {
      img: casts[idx].avatars ?  casts[idx].avatars.large: '',
      name: casts[idx].name
    }
    array.push(cast)
  }
  return array
}

module.exports = {
  convertToStarsArray: convertToStarsArray,
  http: http,
  convertToCastString,
  convertToCastInfos
}


