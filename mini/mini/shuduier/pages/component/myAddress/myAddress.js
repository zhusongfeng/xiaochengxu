// pages/component/myAddress/myAddress.js
const app = getApp();
Page({
  data: {
    hiddenLoading: false,
    addressList: '',
    isback: false,
    address_id: '',
  },
  onLoad: function (options) {
    console.log('********' + JSON.stringify(options))
    // 点击是否返回上层
    this.setData({
      isback: options.isback,
      address_id: options.address_id,
    })
  },
  onShow: function() {
    // 判断是否登陆
    var _this = this;
    // var address_id = this.data.address_id;
   
    wx.request({
      url: app.globalData.server + '/api/v5/mini/myInfo',
      data: {
        openid: app.globalData.openid
      },
      success: function (res) {
        _this.setData({
          hiddenLoading: true,
        })
        if (!res.data.status) {
          // 未登录
          wx.redirectTo({
            url: '../login/idencodeLogin/idencodeLogin',
          })
        } else {
          var _this2 = _this;
          // 获取地址
          wx.request({
            url: app.globalData.server + '/api/user/myAddress',
            data: {
              openid: app.globalData.openid
            },
            success: function (res) {
              _this2.setData({
                addressList: res.data.addressList,
              })
            }
          })
        }
      }
    })
  },
  // 点击返回上一层
  back: function (e) {
    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 2];//上一页面
    prevPage.setData({ //直接给上移页面赋值
      address_name: e.currentTarget.dataset.name,
      address_mobile: e.currentTarget.dataset.mobile,
      address_addressStr: e.currentTarget.dataset.addressstr,
      address_id: e.currentTarget.dataset.address_id,
    });
    if (this.data.isback) {
      wx.navigateBack({
        delta: 1
      })
    }
  },
})