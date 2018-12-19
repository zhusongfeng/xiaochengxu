//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    server: app.globalData.server,
    hiddenLoading: false,
    menuImgArray: [
      { id: 0, menuName: "在线办证", imgSrc: '../../image/zaixianbanzhen.png', bindtap:"ecardorder"},
      { id: 1, menuName: "我的借阅", imgSrc: '../../image/wodejieyue.png', bindtap: "myBorrow" }
    ],
    // 首页专题
    newbooks: '',
    quickbooks: '',
  },
  onLoad: function (options) {
    var _options = options;
    var _this = this;
    // 获取openid
    if (!app.globalData.openid) {
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
                _this.wxScanLogin(_options);
              }
            })
          }
        }
      })
    } else {
      this.wxScanLogin(options);
    }
    var _this = this;
    wx.request({
      url: app.globalData.server + '/api/v4',
      success: function(res) {
        var newbooks = res.data.newbooks;
        var quickbooks = res.data.quickbooks;
        for (var index in newbooks.bookList) {
          var coverimg = newbooks.bookList[index].coverimg;
          if (coverimg.indexOf("//img") == -1 && coverimg.indexOf("http") == -1) {
            newbooks.bookList[index].coverimg = app.globalData.server + coverimg;
          }
        }
        for (var index in quickbooks.bookList) {
          var coverimg = quickbooks.bookList[index].coverimg;
          if (coverimg.indexOf("//img") == -1 && coverimg.indexOf("http") == -1) {
            quickbooks.bookList[index].coverimg = app.globalData.server + coverimg;
          }
        }
        _this.setData({
          newbooks: newbooks,
          quickbooks: quickbooks,
          hiddenLoading: true,
        })
      }
    })
  },
  scanner:function(e){
    wx.scanCode({
      success: (res) => {
        this.setData({
          img: res.result
        })
      },
    })
  },
  // 图书封面显示错误时用默认封面代替
  errorCoverimg: function (e) {
    if (e.type == "error") {
      var errorImgIndex = e.target.dataset.errorimg //获取错误图片循环的下标
      var newbooks = this.data.newbooks;
      var quickbooks = this.data.quickbooks;
      var imgList = this.data.newbooks.bookList; 　  //将图片列表数据绑定到变量
      var imgList2 = this.data.quickbooks.bookList; 　
      imgList[errorImgIndex].coverimg = "../../image/default_coverimg.png"; //错误图片替换为默认图片
      imgList2[errorImgIndex].coverimg = "../../image/default_coverimg.png"; 
      this.setData({
        newbooks: newbooks,
        quickbooks: quickbooks,
      })
    }
  },
  // 在线办证
  ecardorder: function (e) {
    this.setData({
      hiddenLoading: false,
    })
    var _this = this;
    wx.request({
      url: app.globalData.server + '/api/v4/ecard/index',
      data: {
        openid: app.globalData.openid
      },
      success: function (res) {
        _this.setData({
          hiddenLoading: true,
        })
        var errorKey = res.data.errorKey;
        if (errorKey){
          if (errorKey == "ecardOrderAudit") { //正在审核
            wx.navigateTo({
              url: "../component/paySuccess/paySuccess"
            })
          } else if (errorKey == "subPayNotpass" || errorKey == "subInfoNotpass") { //审核拒绝
            wx.navigateTo({
              url: "../component/auditFailure/auditFailure?reasonList=" + res.data.reasonList
              + "&errorKey=" + errorKey
            })
          }  else if (errorKey == "ecardOrderPass") { //在线办证订单审核成功
            wx.navigateTo({
              url: "../component/auditSuccess/auditSuccess"
            })
          } else if (errorKey == "notFindUser") { //未登陆
            wx.navigateTo({
              url: "../component/login/idencodeLogin/idencodeLogin"
            })
          }
        }else{
          wx.navigateTo({
            url: "../component/onlineCertificate/onlineCertificate"
          })
        }
      }
    })
  },
 // 我的借阅
  myBorrow:function(){
    wx.navigateTo({
      url: '../component/myBorrow/myBorrow'
    })
  },
  // 扫码登录
  scanLogin: function (e) {
    var _this = this;
    if (app.globalData.scan_tip){
      wx.showModal({
        title: '提示',
        content: '扫码登录目前只用于智能微图设备，其他二维码均无效',
        showCancel: false,
        success: function (res) {
          _this.scan();
        }
      })
      app.globalData.scan_tip = false;
    }else{
      this.scan();
    }
  },
  scan: function(){
    var _this = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        var result;
        try {
          result = JSON.parse(res.result);
        } catch (e) {
          wx.showModal({
            title: '提示',
            content: '无效的二维码',
            showCancel: false
          })
          return;
        }
        if (!result.mac || !result.token) {
          wx.showModal({
            title: '提示',
            content: '无效的二维码',
            showCancel: false
          })
          return;
        }
        _this.setData({
          hiddenLoading: false,
        })
        app.globalData.sgr_mac = result.mac;
        // 判二维码是否有效
        var _this2 = _this;
        var qrcode_token = result.token;
        wx.request({
          url: app.globalData.server + '/api/v5/mini/valiQrocde',
          data: {
            mac: result.mac,
            token: qrcode_token
          },
          success: function (res) {
            _this2.setData({
              hiddenLoading: true,
            })
            if (res.data.errcode == 0) {
              // 二维码正确
              wx.navigateTo({
                url: "../component/shuguiLogin/bookcardLogin/bookcardLogin?qrcode_token=" + qrcode_token
              })
            } else {
              wx.showModal({
                title: '提示',
                content: '二维码无效或已过期',
                showCancel: false
              })
              return;
            }
          }
        })
      }
    })
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {

  },
  // 扫描普通二维码链接处理登录
  wxScanLogin(options){
    var url = decodeURIComponent(options.q);
    if (url != null && url != '' && url != 'undefined') {
      try {
        var paras = url.split("?")[1].split("&");
        var mac = paras[0].split('=')[1];
        // 下面获取的token分为两种，一种参数为 token, 用户二维码登录，两一种为 doorno， 用户打开柜门
        var token = paras[1].split('=')[1];
        app.globalData.sgr_mac = mac;
      } catch (e) {
        wx.showModal({
          title: '提示',
          content: '无效的二维码',
          showCancel: false
        })
        return;
      }
      if (!mac || !token) {
        wx.showModal({
          title: '提示',
          content: '无效的二维码',
          showCancel: false
        })
        return;
      }
      this.setData({
        hiddenLoading: false,
      })
      // 判二维码是否有效
      var _this = this;
      wx.request({
        url: app.globalData.server + '/api/v5/mini/valiQrocde',
        data: {
          mac: mac,
          token: token
        },
        success: function (res) {
          _this.setData({
            hiddenLoading: true,
          })
          if (res.data.errcode == 0) {
            var doorno = res.data.doorno;
            // 二维码正确
            wx.navigateTo({
              url: "../component/shuguiLogin/bookcardLogin/bookcardLogin?doorno=" + doorno + "&qrcode_token=" + token,
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '二维码无效或已过期',
              showCancel: false
            })
            return;
          }
        }
      })
    }
  }
})
