const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    libArray: [],
    libIndex: 0,
    libIndexCode: '',
    cardno: '',
    cardpwd: '',
    hiddenLoading: true,
  },
  bindChangeLib: function (e) {
    var libIndex = e.detail.value;
    var libIndexCode = this.data.libArray[libIndex].code;
    this.setData({
      libIndex: libIndex,
      libIndexCode: libIndexCode,
    })
  }, 
  onLoad: function (e) {
    var mac = e.mac;
    var _this = this;
    wx.request({
      url: app.globalData.server + '/api/v4/org/orgList',
      success: function (res) {
        var orgList = res.data.orgList;
        _this.setData({
          libArray: orgList,
        })
        var _this2 = _this;
        if (mac != null && mac != '' && mac != 'undefined'){
          wx.request({
            url: app.globalData.server + '/api/v5/mini/getOrg',
            data: {mac: mac},
            success: function (res) {
              var code = res.data.org_code;
              for (var index in orgList) {
                if(orgList[index].code == code){
                  _this2.setData({
                    libIndex: index,
                    libIndexCode: code,
                  })
                }
              }
            }
          })
        }
      }
    })
  },
  onShow: function () {
    var _this = this;
    wx.request({
      url: app.globalData.server + '/api/v5/mini/myInfo',
      data: {
        openid: app.globalData.openid
      },
      success: function (res) {
        if (!res.data.status) {
          wx.navigateTo({
            url: '../../login/idencodeLogin/idencodeLogin',
          })
        }
      }
    })
  },
  //获取用户输入的读者卡
  cardnoInput: function (e) {
    this.setData({
      cardno: e.detail.value
    })
  },
  //获读者卡密码
  cardpwdInput: function (e) {
    this.setData({
      cardpwd: e.detail.value
    })
  }, 
  // 绑卡
  binding: function (e) {
    var _this = this;
    var cardno = this.data.cardno;
    var cardpwd = this.data.cardpwd;
    var org_id = this.data.libArray[this.data.libIndex].id;
     if (!cardno ||!cardpwd){
      wx.showToast({ title: '请将信息填写完整', icon: 'none', duration: 2000 })
      return;
    }
    if (!(/[0-9]/.test(cardno))) {
      wx.showToast({ title: '读者证号错误', icon: 'none', duration: 2000 })
      return;
    }
    this.setData({
      hiddenLoading: false,
    })
    wx.request({
      url: app.globalData.server + '/api/v4/user/bindingCard',
      data: {
        cardno: cardno, cardpwd: cardpwd, org_id: org_id,
        openid: app.globalData.openid
      },
      success: function(res) {
        _this.setData({
          hiddenLoading: true,
        })
        if(res.data.status){
          wx.showModal({
            title: '提示',
            content: '绑定成功',
            showCancel: false,
            success: function (res) {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        } else {
          wx.showToast({ title: res.data.message, icon: 'none', duration: 2000 })
          return;
        }
      }
    })
  },
  ecard: function(){
    var _this = this;
    wx.request({
      url: app.globalData.server + '/api/v4/ecard',
      data: {
        openid: app.globalData.openid
      },
      success: function (res) {
        _this.setData({
          hiddenLoading: true,
        })
        if (res.data.errorKey == "ecardOrderPass") {
          wx.redirectTo({
            url: '../../auditSuccess/auditSuccess',
          })
        } else if (res.data.errorKey == "subPayNotpass" || res.data.errorKey == "subInfoNotpass") {
          wx.redirectTo({
            url: '../../auditFailure/auditFailure',
          })
        } else if (res.data.errorKey == "ecardOrderAudit") {
          wx.redirectTo({
            url: '../../paySuccess/paySuccess',
          })
        } else {
          wx.redirectTo({
            url: '../../onlineCertificate/onlineCertificate?org_code=' + _this.data.libIndexCode,
          })
        }
      }
    })
  }
})