// pages/component/bookOrder/bookOrder.js
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
    isbn: '',
    coverimg: '../../../image/default_coverimg.png',
    returnAddress: '',
    address: '',
    address_id: '',
    address_name: '',
    address_mobile: '',
    address_addressStr: '',
    onlinemaxborrow: '',
    maxborrow: '',
    orgname: '',
    cardno: '',
    readercard_id: '',
    remark: '',
  }, 
  onLoad: function (options) {
    console.log('ccccccc' + JSON.stringify(options));
    var book_id = options.book_id;
    this.setData({
      book_id: book_id,
      hiddenLoading: false,
    })
    var _this = this;
    wx.request({
      url: app.globalData.server + '/api/v5/mini/borrowDetail/' + book_id,
      data: {
        openid: app.globalData.openid,
      },
      success: function (res) {
        var coverimg = res.data.book.coverimg;
        if (coverimg.indexOf("//img") == -1 && coverimg.indexOf("http") == -1) {
          coverimg = app.globalData.server + coverimg;
        }
        _this.setData({
          hiddenLoading: true,
          title: res.data.book.title,
          author: res.data.book.author,
          price: res.data.book.price,
          isbn: res.data.book.isbn,
          coverimg: coverimg,
          address: res.data.address,
          returnAddress: res.data.returnAddress,
          onlinemaxborrow: res.data.onlinemaxborrow,
          maxborrow: res.data.maxborrow,
          borrowperiod: res.data.borrowperiod,
          renewperiod: res.data.renewperiod,
          orgname: res.data.org.name,
          cardno: res.data.readercard.cardno,
          readercard_id: res.data.readercard.id,
        })
        if (res.data.address){
          _this.setData({
            address_id: res.data.address.id,
            address_name: res.data.address.name,
            address_mobile: res.data.address.mobile,
            address_addressStr: res.data.address.addressStr,
          })
        }
      } 
    })
  },
  selectAddress: function () {
    wx.navigateTo({
      url: '../selectAddress/selectAddress',
    })
  },
  submit:function(){
    wx.navigateTo({
      url: '../bookOrderSuccess/bookOrderSuccess',
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
  onShow: function () {
    var _this = this;
    wx.request({
      url: app.globalData.server + '/api/v4/borrow/borrowRule',
      data: {
        readercard_id: this.data.readercard_id,
      },
      success: function (res) {
        _this.setData({
          returnAddress: res.data.returnAddress,
          onlinemaxborrow: res.data.onlinemaxborrow,
          maxborrow: res.data.maxborrow,
          borrowperiod: res.data.borrowperiod,
          renewperiod: res.data.renewperiod,
        })
      }
    })
  },
  //获取输入的备注信息
  remarkInput: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },
  submit: function () {
    if(!this.data.address_mobile){
      wx.showToast({ title: '请先添加收货地址', icon: 'none', duration: 2000 })
      return;
    }
    this.setData({
      hiddenLoading: false,
    })
    var _this = this;
    wx.request({
      url: app.globalData.server + '/api/v4/borrow/borrowBook',
      data: {
        readercard_id: this.data.readercard_id,
        book_id: this.data.book_id,
        address_id: this.data.address_id,
        openid: app.globalData.openid,
        leaveMsg: this.data.remark,
      },
      success: function (res) {
        _this.setData({
          hiddenLoading: true,
        })
        if(res.data.status){
          wx.redirectTo({
            url: '../bookOrderSuccess/bookOrderSuccess?borrowno=' + res.data.borrowno,
          })
        }else{
          wx.showToast({ title: res.data.message, icon: 'none', duration: 3000 })
          return;
        }
      }
    })
  }
})