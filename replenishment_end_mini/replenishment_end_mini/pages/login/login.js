//index.js
//获取应用实例
const app = getApp()
const {HOST, URL} = require('../../utils/api.js')

const EXPIRED_TIME = 24 * 3600 * 1000
Page({
  data: {
    wxUserInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    code: '',
    userNameCheck: { name: 'recordUserName', value: 1, checked: 'true', text: '记住用户名' },
    userlist: ["asd","sfsdf"],
    currentUser: '',
    showArr: false,
    showList: false,
    isRecordUserName: true,
    verificationCode: {
      hadSend: false,
      content: '发送验证码'
    },
    loginData: {
      tel: '',
      password: '',
      verificationCode: ''
    },
    errMsg: ''
  },
  onLoad: function () {
    if (wx.getStorageSync('expired')  > Date.now()) {
      wx.switchTab({
        url: '/pages/index/index',
      })
    } else {
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          this.setData({
            code: res.code
          })
        }
      })
      let cookieUserInfo = wx.getStorageSync('wxUserInfo');
      if (cookieUserInfo) {
        this.setData({
          wxUserInfo: JSON.parse(cookieUserInfo),
          hasUserInfo: true
        })
      } else if (this.data.canIUse) {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          app.globalData.wxUserInfo = res.userInfo
          wx.setStorage({
            key: 'wxUserInfo',
            data: JSON.stringify(res.userInfo),
          })
          this.setData({
            wxUserInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            app.globalData.wxUserInfo = res.userInfo
            wx.setStorage({
              key: 'wxUserInfo',
              data: JSON.stringify(res.userInfo),
            })
            this.setData({
              wxUserInfo: res.userInfo,
              hasUserInfo: true
            })
          }
        })
      }
    }  
  },
  onShow: function () {
    let _self = this;
    wx.getStorage({
      key: 'currentUser',
      success: function (res) {
        _self.setData({ currentUser: res.data })
       
       _self.setData({'loginData.tel': res.data });
  
      },
      fail: function () {
        console.log("还没有当前用户名记录");
      }
    })
    wx.getStorage({
      key: 'UserName',
      success: function (res) {
        _self.setData({ userlist: res.data })
        if (_self.data.userlist.length > 0) {
          _self.setData({ showArr: true })
        } else {
          _self.setData({ showArr: false })
        }
      },
      fail: function () {
        console.log("还没有用户名记录");
      }
    })
  },
  loginVerify(){

  },
  getUserInfo: function (e) {
    app.globalData.wxUserInfo = e.detail.userInfo
    wx.setStorage({
      key: 'wxUserInfo',
      data: JSON.stringify(e.detail.userInfo),
    })
    this.setData({
      wxUserInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  inputLoginData(e) {
    this.setData({
      errMsg: ''
    })
    var item = e.target.dataset.item;
    this.setData({
      ['loginData.' + item]: e.detail.value
    });
  },
  sendVerificationCode() {
    let time = 60;
    this.setData({
      verificationCode: {
        hadSend: true,
        content: time + '秒后可重新获取验证码'
      }
    });
    var codeTimer = setInterval(() => {
      this.setData({
        'verificationCode.content': --time + '秒后可重新获取验证码'
      })
      if (time === 0) {
        clearTimeout(codeTimer);
        codeTimer = null;
        this.setData({
          verificationCode: {
            hadSend: false,
            content: '发送验证码'
          }
        })
      }
    }, 1000)
  },
  checkboxChange: function(e){
    let length = e.detail.value.length;
    if (length === 0){
      this.setData({
        isRecordUserName:false
      });
    }else{
      this.setData({
        isRecordUserName: true
      });
    }
  },
  toshowlist: function (e) {
    if (this.data.showList) {
      this.setData({ showList: false });
    } else {
      this.setData({ showList: true });
    }
  },
  inputUser: function (e) {
    let username = e.currentTarget.dataset.name;
    this.setData({ currentUser: username });
    this.setData({ showList: false });
    this.setData({ 'loginData.tel': username });
  },
  removeUser: function (e) {
    let username = e.currentTarget.dataset.name;
    console.log(username);
    wx.getStorage({
      key: 'UserName',
      success: function (res) {
        let userNameList = res.data;
        if (userNameList.indexOf(username) > -1) {
          userNameList.splice(userNameList.indexOf(username), 1);
          wx.setStorage({
            key: "UserName",
            data: userNameList
          })
        }
      },
      fail: function () {
        console.log("removeUser fail");
      }
    });
    console.log(this.data.userlist);
    this.data.userlist.splice(this.data.userlist.indexOf(username), 1);
    this.setData({ userlist: this.data.userlist })
  },
  login() {
    let loginData = this.data.loginData;
    if (!loginData.tel || !loginData.password) {
      this.setData({
        errMsg: '手机号/密码/验证码 不能为空！'
      })
    } else {
      // let { username, password, isRecord } = [loginData.tel, loginData.password, this.data.isRecordUserName];
      let username = loginData.tel,
          password = loginData.password,
          isRecord = this.data.isRecordUserName,
          userNameList = [];
      wx.showLoading({
        title: '验证中',
        success: () => {
          wx.request({
            url: HOST + URL.login,
            method: 'POST',
            dataType: 'json',
            header: {
              'Authorization': 'Basic dGVzdDpwYXNzd2Q=',
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
              username: loginData.tel,
              password: loginData.password
            },
            success: ({data, header}) => {
              wx.setStorageSync('cookie', header['Set-Cookie'])
              if (data.code === '00') {
                wx.setStorageSync('expired', Date.now() + EXPIRED_TIME)
             
                if (isRecord) {
                  //判断storage里是否已经存在此username
                  wx.getStorage({
                    key: 'UserName',
                    success: function (res) {
                      userNameList = res.data;
                      if (userNameList.indexOf(username) === -1) {
                        userNameList.push(username);
                        wx.setStorage({
                          key: "UserName",
                          data: userNameList
                        })
                      }
                    },
                    fail: function () {
                      console.log("还没有UserName");
                      userNameList.push(username);
                      wx.setStorage({
                        key: "UserName",
                        data: userNameList
                      })
                    }
                  });
                    wx.setStorage({
                      key: 'currentUser',
                      data: username,
                    })
                }else{
                  console.log("不允许被记录")
                }
                wx.switchTab({
                  url: '/pages/index/index',
                })
              } else {
                this.setData({
                  errMsg: data.message
                })
              }
            },
            error(e) {
              console.log('error' + e)
            },
            complete() {
              wx.hideLoading();
            }
          })
        }
      })
    }
  }
})
