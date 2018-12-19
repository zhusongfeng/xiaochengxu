// pages/component/login/idencodeLogin/idencodeLogin.js
const {HOST, URL} = require('../../../utils/api');
const app = getApp();
let interval = null; //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    code: '',
    phoneCode: '',
    time: '获取验证码', //倒计时 
    currentTime: 61,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  //获取手机号
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //获取联系地址
  codeInput: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  account_val: function (e) {
    this.setData({
      phone: e.detail.value.replace(/\s+/g, "")
    })
  },
  // 获取验证码
  getCode: function (e) {
    let self = this;
    let currentTime = self.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      self.setData({
        time: currentTime + '秒后重新获取'
      });
      if (currentTime <= 0) {
        clearInterval(interval);
        self.setData({
          time: '重新发送',
          currentTime: 61,
          disabled: false
        })
      }
    }, 1000)  
  }, 
  getVerificationCode() {
    let phone = this.data.phone;
    if (!(/^1[3456789]\d{9}$/.test(phone))) {
      wx.showToast({ title: '请输入正确的手机号码', icon: 'none', duration: 2000 })
      return;
    }
    this.getCode();
    this.setData({
      disabled: true
    });
    let self = this;
    wx.request({
          url: HOST + URL.phoneCode,
          method: 'GET',
          header: {
              'Authorization': 'Basic dGVzdDpwYXNzd2Q=',
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
              phone: this.data.phone,
          },
          success: (res) => {
            self.setData({
                phoneCode:res.data.phoneCode
            })
          },
          error(e) {
              console.log('error' + e)
          },

      })
  },
  // 登录
  loginIn: function (e) {
    let self = this;
    let openid = app.globalData.openid;

    if (!openid) {
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.request({
                url: HOST + URL.openId,
                method: 'GET',
                header: {
                    'Authorization': 'Basic dGVzdDpwYXNzd2Q=',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: {
                    code: res.code,
                },
                success: (res) => {
                    app.globalData.openid = res.data.openid;
                    self.login();
                },
                error(e) {
                    console.log('error' + e)
                },
            })
          }
        }
      })
    }else{
      self.login();
    }
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

  login: function () {
    let self = this;
    let phone = self.data.phone;
    let code = self.data.code;
    let phoneCode = self.data.phoneCode;
    if (!(/^1[3456789]\d{9}$/.test(phone))) {
      wx.showToast({ title: '请输入正确的手机号码', icon: 'none', duration: 2000 });
      return;
    }
    if (!code) {
      wx.showToast({ title: '请输入验证码', icon: 'none', duration: 2000 });
      return;
    }
    if (!phoneCode) {
      wx.showToast({ title: '请先获取验证码', icon: 'none', duration: 2000 });
      return;
    }
      wx.request({
          url: HOST + URL.login,
          method: 'GET',
          header: {
              'Authorization': 'Basic dGVzdDpwYXNzd2Q=',
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
              phone: phone,
              code: code,
              phoneCode: phoneCode,
              openid: app.globalData.openid,
          },
          success: (res) => {
              if(res.data.status){
                  console.log(1111111,app.globalData.openid);
                wx.showToast({title: "登录成功！", icon: 'none', duration: 2000 });
                  //登录成功跳转到首页
                  wx.switchTab({
                      url: '/pages/index/index',
                  })
              }else {
                wx.showToast({title:res.data.message,icon:'none',duration:2000});
                return
              }
          },
          error(e) {
              console.log('error' + e)
          },
      })
  }
})
