//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  onLoad: function (options) {
    var subject_id = options.subject_id;
    this.setData({
      hiddenLoading: false,
      subject_id: subject_id
    })
    var _this = this;
    wx.request({
      url: app.globalData.server + '/api/book/subjectBookList/' + subject_id,
      success: function (res) {
        var newbooks = res.data;
        for (var index in newbooks.bookList) {
          var coverimg = newbooks.bookList[index].coverimg;
          if (coverimg != null) {
            if (coverimg.indexOf("//img") == -1 && coverimg.indexOf("http") == -1) {
              newbooks.bookList[index].coverimg = app.globalData.server + coverimg;
              }
            } else {
              newbooks.bookList[index].coverimg = "../../../image/default_coverimg.png";
            }
        }
        _this.setData({
          newbooks: newbooks,
          hiddenLoading: true,
        })
      }
    })
  },
  // 图书封面显示错误时用默认封面代替
  errorCoverimg: function (e) {
    if (e.type == "error") {
      var errorImgIndex = e.target.dataset.errorimg //获取错误图片循环的下标
      var newbooks = this.data.newbooks;
      var imgList = this.data.newbooks.bookList; 　  //将图片列表数据绑定到变量
      imgList[errorImgIndex].coverimg = "../../image/default_coverimg.png"; //错误图片替换为默认图片
      this.setData({
        newbooks: newbooks,
      })
    }
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