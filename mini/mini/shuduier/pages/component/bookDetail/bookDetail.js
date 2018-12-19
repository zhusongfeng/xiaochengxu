// pages/component/bookDetail/bookDetail.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    book_id: '',
    hiddenLoading: true,
    title: '',
    author: '',
    price: '',
    content: '暂无内容',
    publisher: '',
    isbn: '',
    publishdate: '', 
    coverimg: '../../../image/default_coverimg.png',
  },
  onLoad: function (options) {
    var book_id = options.book_id;
    this.setData({
      hiddenLoading: false,
      book_id: book_id
    })
    var _this = this;
    wx.request({
      url: app.globalData.server + '/api/book/' + book_id,
      success: function (res) {
        var book = res.data.book;
        _this.setData({
          hiddenLoading: true,
          title: book.title,
          author: book.author,
          price: book.price,
          publisher: book.publisher,
          isbn: book.isbn,
          publishdate: book.publishdate,
          coverimg: book.coverimg,
        })
        if (book.bookExt.contentintro){
          _this.setData({
            content: book.bookExt.contentintro,
          })
        }
      }
    })
  },
  // 图书封面显示错误时用默认封面代替
  errorCoverimg: function (e) {
    if (e.type == "error") {
      this.setData({
        coverimg: '../../../image/default_coverimg.png',
      })
    }
  },
  borrowDetail: function (){
    var _this = this;
    wx.request({
      url: app.globalData.server + '/api/v5/mini/myInfo',
      data: {
        openid: app.globalData.openid,
      },
      success: function (res) {
        _this.setData({
          hiddenLoading: true,
        })
        // 判断登录
        if (!res.data.status) {
          wx.navigateTo({
            url: '../login/idencodeLogin/idencodeLogin',
          })
        }else{
          // 判断绑卡
          var _this2 = _this;
          wx.request({
            url: app.globalData.server + '/api/user/isBinding',
            data: {
              openid: app.globalData.openid
            },
            success: function (res) {
              if (!res.data.status) {
                wx.showModal({
                  title: '提示',
                  content: '请先绑定您的读者卡',
                  success: function (res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '../bookcard/bindBookcard/bindBookcard',
                      })
                    }
                  }
                })
              } else {
                wx.redirectTo({
                  url: '../bookOrder/bookOrder?book_id=' + _this2.data.book_id,
                })
              } 
            }
          })
        }
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '',
      path: ''
    }
  }
})