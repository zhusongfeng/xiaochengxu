const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatDate = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  let preDate = new Date(date)
  preDate.setHours(0, 0, 0, 0)

  let nowDate = new Date()
  nowDate.setHours(0, 0, 0, 0)

  if (nowDate - preDate > 24 * 3600 * 1000) {
    return formatTime(date).split(' ')
  } else if (+preDate === +nowDate) {
    return ['今天', [hour, minute, second].map(formatNumber).join(':')]
  } else {
    return ['昨天', [hour, minute, second].map(formatNumber).join(':')]
  }
}
const compare = propertyName => {
  (object1, object2) => {
    var value1 = object1[propertyName];
    var value2 = object2[propertyName];
    if (value2 < value1) {
      return 1;
    } else if (value2 > value1) {
      return -1;
    } else {
      return 0;
    }
  }
}
const testhost = "http://112.124.100.236:9505" //测试环境
// const producthost = "https://oa1.eguagua.cn" //生产环境  发布时不用动这个文件，没用到这里的host
const wxRequest = (method, data, path, callback) => {
  var url = testhost + path;
  try {
    if ((typeof method).toLocaleLowerCase() !== 'string') {
      throw Error('method must string,(method,data,url,callback)');
    }
    if ((typeof data).toLocaleLowerCase() !== 'object') {
      throw Error('data must object,(method,data,url,callback)');

    }
    if ((typeof url).toLocaleLowerCase() !== 'string') {
      throw Error('url must string,(method,data,url,callback)');

    }
    if ((typeof callback).toLocaleLowerCase() !== 'function') {
      throw Error('callback must function,(method,data,url,callback)');

    }

  } catch (error) {
    console.error(error);
    return false
  }
  method = method.toUpperCase();
  var cookie = wx.getStorageSync("sessionid") || '';
  var header = /login/.test(url) ? 'application/x-www-form-urlencoded' : 'application/json';
  wx.request({
    url: url, //仅为示例，并非真实的接口地址
    data: data,
    method: method,
    header: {
      'content-type': header, // 默认值
      'Cookie': cookie
    },
    success: (res) => {
      if (res.data.code === '00') {
        if (res.header["Set-Cookie"]) {
          wx.setStorageSync("sessionid", res.header["Set-Cookie"]);
        }
        callback(res)
      } else if (res.data.code.toUpperCase() === 'LP9995' || res.data.code.toUpperCase() === '9999') {
        new Promise(function(resolve, reject) {
          wx.showToast({
            title: res.data.message,
            duration: 2000,
            image: '../img/error.png',
            complete: function() {
              setTimeout(function() {
                resolve('a')
              }, 2000)

            }
          })
        }).then(function() {
          wx.redirectTo({
            url: '../login/login'
          })
        })
      } else {
        wx.showToast({
          title: res.data.message,
          duration: 2000,
          image: '../img/error.png'
        })
      }


    },
    fail: (res) => {
      console.error(res)
    }
  })
}

module.exports = {
  formatTime,
  formatDate,
  wxRequest,
  compare
}