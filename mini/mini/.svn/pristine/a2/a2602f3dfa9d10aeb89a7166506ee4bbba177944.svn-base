// pages/component/myBorrow/myBorrow.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenLoading: true,
  },
  /**
   * 保存图片测试
   */
  saveImgTest: function () {
    this.setData({
      hiddenLoading: false,
    })
    var _this = this;
    // 可以通过 wx.getSetting 先查询一下用户是否授权了
    wx.downloadFile({
      url: 'https://www.shuduier.com/mini/mini_sdr_to_app.png',
      success: function (res) {
        var _this2 = _this;
        let path = res.tempFilePath
        wx.getSetting({
          success(res) {
            var _this3 = _this2;
            if (!res.authSetting['scope.writePhotosAlbum']) {
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success() {
                  _this2.setData({
                    hiddenLoading: true,
                  })
                },
                fail() {
                  wx.showModal({
                    title: '提示',
                    content: '您未授权保存到相册，打开设置进行授权',
                    success: function (res) {
                      _this3.setData({
                        hiddenLoading: true,
                      })
                      if (res.confirm) {
                        wx.openSetting({

                        })
                      }
                    }
                  })
                }
              })
            } else {
              _this2.setData({
                hiddenLoading: false,
              })
              wx.saveImageToPhotosAlbum({
                filePath: path,
                success(res) {
                  _this2.setData({
                    hiddenLoading: true,
                  })
                  if (res.errMsg == 'saveImageToPhotosAlbum:ok') {
                    wx.showModal({
                      title: '提示',
                      content: '保存成功，可在手机相册中查看',
                      showCancel: false
                    })
                  } else {
                    wx.showToast({ title: '保存失败', icon: 'none', duration: 2000 })
                    return;
                  }
                }
              })
            }
          }
        })
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
  
  }
})