//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad: function (options) {
    var searchWord = options.key;    
    var _this = this;
    wx.request({
      url: app.globalData.server + '/api/book/search/',
      data: {
        key: searchWord
      },
      success: function (res) {
        var newbooks = res.data;
        if (newbooks.bookList == null || newbooks.bookList == '') {
          wx.showModal({
            title: '温馨提示',
            content:'暂无图书数据',
            success:function(res){
              if (res.confirm) {
                wx.navigateBack({
                });
              } else {
                wx.navigateBack({
                });
              }
            }
          })
        }
        for (var index in newbooks.bookList) {
          var coverimg = newbooks.bookList[index].coverimg;//图书的图片
          if (coverimg!=null){
            if (coverimg.indexOf("//img") == -1 && coverimg.indexOf("http") == -1) {
              newbooks.bookList[index].coverimg = app.globalData.server + coverimg;
            }
          }else{
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
})