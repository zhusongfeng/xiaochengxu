// pages/component/payDeposit/payDeposit.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ecardFee:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    wx.request({
      url: app.globalData.server +' ',
      data: {
        openid: app.globalData.openid
      },
      success:function(res){
        _this.setData({
          hiddenLoading: true,
        })
        if(res.data.status){
          _this.setData({
            ecardFee: res.data.fee
          });
        }else{
          wx.showToast({
            title: res.data.message,
          })
        }
      }
    })  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  wxpay: function () {
    this.setData({
      hiddenLoading: false,
    })
    var _this = this;
    wx.request({
      url: app.globalData.server + '/api/v5/mini/miniwxpay',
      data: {
        openid: app.globalData.openid
      },
      success: function (res) {
        _this.setData({
          hiddenLoading: true,
        })
        var _this2 = _this;
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': 'prepay_id=' + res.data.prepay_id,
          'signType': 'MD5',
          'paySign': res.data.sign,
          'success': function (res) {
            _this2.setData({
              hiddenLoading: false,
            })
            var _this3 = _this2;
            wx.request({
              url: app.globalData.server + '/api/v4/ecard/payOk',
              data: {
                openid: app.globalData.openid
              },
              success: function (res) {
                _this3.setData({
                  hiddenLoading: true,
                })
                wx.redirectTo({
                  url: "../paySuccess/paySuccess"
                })
              }
            })
          },
          'fail': function (res) {
          }
        })
      }
    })
  },

  zhima: function () {
    wx.navigateTo({
      url: '../myBorrow/myBorrow'
    })
  }
})