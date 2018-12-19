// pages/component/auditSuccess/auditSuccess.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    idcard: '',
    phone: '',
    address: '',
    hiddenLoading: false,
  },
  // 拨打电话
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: '400-128-0528',
      success: function () {
      },
      fail: function () {
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      hiddenLoading: false,
    })
    var _this = this;
    wx.request({
      url: app.globalData.server + '/api/v4/ecard/ecardOrderInfo',
      data: {
        openid: app.globalData.openid
      },
      success: function(res) {
        _this.setData({
          hiddenLoading: true,
          name: res.data.name,
          cardno:res.data.cardno,
          idcard: res.data.idno,
          phone: res.data.mobile,
          ecardorderno:res.data.ecardorderno,
          address: res.data.address,
        })
      }
    })
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
  
  }
})