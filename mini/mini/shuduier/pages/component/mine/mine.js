// pages/component/mine/mine.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: '登录',
    userCancel:"",
    setPassword:"",
    headpic:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
  },

  // 是否登陆跳转
  isLogin: function (e) {
    if (this.data.user == '登录') {
      wx.navigateTo({
        url: "../login/idencodeLogin/idencodeLogin"
      })
    }
  },

  //退出登录
  cancelLogin:function(e){
    if (this.data.userCancel == '退出') {
      var _this = this;
      wx.request({
        url: app.globalData.server + '/api/v5/mini/loginOut',
        data: {
          openid: app.globalData.openid
        },
        success: function (res) {
          if (res.data.status) {
            _this.setData({
              user: "登录",
              userCancel: '',
              setPassword: ""
            })
            wx.showToast({
              title: '退出登录成功',
              icon: '',
              duration: 2000
            })  
            
          } else {
            wx.showToast({
              title: res.data.message,
              icon: '',
              duration: 2000
            })
          }
        }
      })
      wx.navigateTo({
        url: '../../index/index',
      }) 
    }
  },

  //设置密码
  setting: function () {
    wx.navigateTo({
      url: '../securityVerificate/securityVerificate',
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
    var _this = this;
    wx.request({
      url: app.globalData.server + '/api/v5/mini/myInfo',
      data: {
        openid: app.globalData.openid
      },
      success: function (res) {
        if (res.data.status) {
          _this.setData({
            user: res.data.userExt.formatMobile,
            headpic: app.globalData.server + res.data.userExt.avatar,
            userCancel:"退出",
            setPassword:"设置密码"
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
  
  }
})