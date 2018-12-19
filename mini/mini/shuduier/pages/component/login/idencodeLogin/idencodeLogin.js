// pages/component/login/idencodeLogin/idencodeLogin.js
const app = getApp();
var interval = null; //倒计时函数
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
    var _this = this;
    var currentTime = _this.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      _this.setData({
        time: currentTime + '秒后重新获取'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        _this.setData({
          time: '重新发送',
          currentTime: 61,
          disabled: false
        })
      }
    }, 1000)  
  }, 
  getVerificationCode() {
    var phone = this.data.phone;
    if (!(/^1[3456789]\d{9}$/.test(phone))) {
      wx.showToast({ title: '请输入正确的手机号码', icon: 'none', duration: 2000 })
      return;
    }
    this.getCode();
    this.setData({
      disabled: true
    });
    var _this = this;
    wx.request({
      url: app.globalData.server + '/api/v5/mini/phoneCode',
      data: {
        phone: this.data.phone,
      },
      success: function (res) {
        console.log('aaaaaaa' + JSON.stringify(res));
        _this.setData({
          phoneCode: res.data.phoneCode
        });
      }
    })
  },
  // 登录
  loginIn: function (e) {
    var openid = app.globalData.openid;
    console.log('333333' + JSON.stringify(openid));

    if (!openid) {
      var _this = this;
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.request({
              url: app.globalData.server + '/api/v5/mini/getOpenid',
              data: {
                code: res.code,
              },
              success: function (res) {
                app.globalData.openid = res.data.openid;
                _this.login(_this);
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

  login: function (p) {
    // console.log('22222' + JSON.stringify(p));
    var phone = p.data.phone;
    var code = p.data.code;
    var phoneCode = p.data.phoneCode;
    if (!(/^1[3456789]\d{9}$/.test(phone))) {
      wx.showToast({ title: '请输入正确的手机号码', icon: 'none', duration: 2000 })
      return;
    }
    if (!code) {
      wx.showToast({ title: '请输入验证码', icon: 'none', duration: 2000 })
      return;
    }
    if (!phoneCode) {
      wx.showToast({ title: '请先获取验证码', icon: 'none', duration: 2000 })
      return;
    }
    wx.request({
      url: app.globalData.server + '/api/v5/mini/loginByCode',
      data: {
        phone: phone, code: code, phoneCode: phoneCode,
        openid: app.globalData.openid,
      },
      success: function (res) {
        console.log('99999'+JSON.stringify(res))
        if (res.data.status) {
          wx.showToast({ title: "登录成功！", icon: 'none', duration: 2000 });
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showToast({ title: res.data.message, icon: 'none', duration: 2000 });
          return;
        }
      }
    })
  }
})