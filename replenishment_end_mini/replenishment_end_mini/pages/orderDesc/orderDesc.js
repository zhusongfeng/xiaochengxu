// pages/orderDesc/orderDesc.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    let order = JSON.parse(decodeURIComponent(query.order))
    // let payIcon = order.payWay === 'wechat' ? '/images/order/icon-Wechat@3x.png'
    //   : order.payWay === 'alipay' ? '/images/order/icon-zhifubao@3x.png' : '';
    // let tradeResult = order.tradeResult === 'success' ? '交易成功' : '  交易失败';
    this.setData({
      order
    });
    
  },
  // 查看设备详情
  toDetailPage(e) {
    let machine = e.currentTarget.dataset.machine;
    wx.navigateTo({
      url: '/pages/machineDetails/machineDetails?machine=' + encodeURIComponent(JSON.stringify(machine))
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
    console.log('bottom')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})