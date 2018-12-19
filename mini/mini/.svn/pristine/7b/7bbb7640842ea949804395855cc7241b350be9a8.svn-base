const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  //获取读者证号
  cardInput: function (e) {
    this.setData({
      cardNum: e.detail.value
    })
  },
  //获取姓名
  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  //获取身份证号
  idcardInput: function (e) {
    this.setData({
      idcard: e.detail.value
    })
  },
  //提交
  submit: function (e) {
    var _this = this;
    var cardNum = this.data.cardNum;
    var name = this.data.name;
    var idcard = this.data.idcard;
    if (!cardNum) {
      wx.showToast({ title: '请输入读者证号', icon: 'none', duration: 2000 })
      return;
    }
    if (!name) {
      wx.showToast({ title: '请输入姓名', icon: 'none', duration: 2000 })
      return;
    }
    if (!(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(idcard))) {
      wx.showToast({ title: '请输入正确的身份证号', icon: 'none', duration: 2000 })
      return;
    }
    wx.request({
      url: app.globalData.server + '/api/v5/mini/unlockReadercard',
      data:{
        openid:app.globalData.openid,
        cardno: cardNum,
        name: name,
        idno: idcard
      },
      success:function(res){
        if(res.data.errcode == -1){
          wx.showToast({title: res.data.errmsg,icon: 'none',duration: 2000 });        
        }else{
          wx.showModal({
            title: "提示",
            content: "解锁成功！点击确定后您可正常在书柜上进行操作",
            showCancel:false,
            success: function (res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '../../../index/index',
                })
              }
            }
          })
        }
      },
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
})