//app.js
App({
  onLaunch: function () {
   // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 获取openid
    var _this = this;
    wx.login({
      success: function (res) {
        console.log('获取openid',res)
        if (res.code) {
          wx.request({
            url: _this.globalData.server + '/api/v5/mini/getOpenid',
            data: {
              code: res.code,
            },
            success: function (res) {
              _this.globalData.openid = res.data.openid;
            }
          })
        }
      }
    })
  },
  globalData: {
    server: "https://www.shuduier.com",
    openid: '',
    sgr_mac: '',
    scan_tip: true,
  }
})