// pages/component/login/passwordLogin/passwordLogin.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: '',
  },
  //获取手机号
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
    // var name = e.currentTarget.dataset.name;
    // this.setData({
    //   [name]: e.detail.value.replace(/\s+/g, '')
    // })
  },
  account_val:function(e){
    this.setData({
      phone: e.detail.value.replace(/\s+/g, "")
    })
  },
  //获取密码
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  loginIn: function (res) {
    var _this = this;
    var openid = app.globalData.openid;
    if (!openid) {
      wx.login({
        success: function (res) {
          var _this2 = _this;
          if (res.code) {
            wx.request({
              url: app.globalData.server + '/api/v5/mini/getOpenid',
              data: {
                code: res.code,
              },
              success: function (res) {
                app.globalData.openid = res.data.openid;
                _this2.login(_this2);
              }
            })
          }
        }
      })
    }else{
      this.login(this);
    }
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
  // 登录
  login: function (p){
    var phone = p.data.phone;
    var password = p.data.password;
    if (!(/^1[3456789]\d{9}$/.test(phone))) {
      wx.showToast({ title: '请输入正确的手机号码', icon: 'none', duration: 2000 })
      return;
    }
    if (!password) {
      wx.showToast({ title: '请输入登录密码', icon: 'none', duration: 2000 })
      return;
    }
    wx.request({
      url: app.globalData.server + '/api/v5/mini/loginByPassword',
      data: {
        username: phone, password: password,
        openid: app.globalData.openid,
      },
      success: function (res) {
        if (res.data.status) {
          wx.showToast({ title: "登录成功！", icon: 'none', duration: 2000 });
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showToast({ title: res.data.message, icon: 'none', duration: 2000 })
          return;
        }
      }
    })
  }  
})