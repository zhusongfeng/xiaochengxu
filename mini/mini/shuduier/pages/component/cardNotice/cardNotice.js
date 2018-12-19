// pages/component/cardNotice/cardNotice.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    org_id: '',
    rule: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      org_id: options.org_id,
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
  onShow: function (options) {
    var _this = this;
    wx.request({
      url: app.globalData.server + '/api/ecard/rule',
      data: {
        org_id: this.data.org_id,
        openid: app.globalData.openid
      },
      success: function(res) {
        _this.setData({
          rule: res.data.rule,
        })
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
  
  }
})