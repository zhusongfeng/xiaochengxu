// pages/component/setPassword/setPassword.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  //获取密码
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  //获取确认密码
  password2Input: function (e) {
    this.setData({
      confirmpassword: e.detail.value
    })
  },
  //提交
  subInfo:function(){
    var password = this.data.password;
    var confirmpassword = this.data.confirmpassword;
    if (!password) {
      wx.showToast({ title: '请输入密码', icon: 'none', duration: 2000 })
      return;
    }
    if (!confirmpassword) {
      wx.showToast({ title: '请确认密码', icon: 'none', duration: 2000 })
      return;
    }
    if (password != confirmpassword){
      wx.showToast({ title: '两次输入密码不一致', icon: 'none', duration: 2000 })
      return;
    }
    wx.request({
      url: app.globalData.server + '/api/user/resetPassword',
      data:{
        openid: app.globalData.openid,
        password: password
      },
      success:function(res){
        if (res.data.status){
          wx.navigateBack({
            delta:2
          })
        }
        wx.showToast({ title: res.data.message, icon: 'none', duration: 2000 })
      }
    })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})