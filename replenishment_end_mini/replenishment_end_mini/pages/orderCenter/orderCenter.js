const {
  formatDate
} = require('../../utils/util.js')
const {
  HOST,
  URL,
  CODE
} = require('../../utils/api.js')
const app = getApp()
const {
  ajax,
  errorMsg
} = app
Page({
  data: {
    searchValue: '',
    orderAreas: [{
        navTitle: '全部订单',
        orderType: 'all',
        scrollTop: 0,
        recordScrollTop: 0,
        data: [],
        page: {
          currentPage: 1,
          pageSize: 10,
          isLoadingOrder: false,
          isLastPage: false
        },
      },
      {
        navTitle: '交易成功',
        orderType: 'success',
        scrollTop: 0,
        recordScrollTop: 0,
        data: [],
        page: {
          currentPage: 1,
          isLoadingOrder: false,
          pageSize: 10,
          isLastPage: false
        },
      },
      {
        navTitle: '交易失败',
        orderType: 'fail',
        scrollTop: 0,
        recordScrollTop: 0,
        data: [],
        page: {
          currentPage: 1,
          isLoadingOrder: false,
          pageSize: 10,
          isLastPage: false
        },
      },
    ],
    navBarIndex: 0,
  },
  togglerNav(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      navBarIndex: index
    })
    if (!this.data.orderAreas[index].data.length) {
      this.firstLoadData();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  toDetailPage(e) {
    let order = encodeURIComponent(JSON.stringify(e.currentTarget.dataset.order));
    wx.navigateTo({
      url: '/pages/orderDesc/orderDesc?order=' + order
    })
  },
  firstLoadData() {
    wx.showLoading({
      title: '数据加载中...',
      mask: true
    })
    this.setOrderData('load', () => {
      wx.hideLoading()
    })
  },
  setOrderData(method = 'load', callback) {
    let {
      orderAreas,
      navBarIndex
    } = this.data;
    if (!this.data.orderAreas[navBarIndex].page.isLoadingOrder) {
      this.setData({
        ['orderAreas[' + navBarIndex + '].page.isLoadingOrder']:true
      })
      this.loadOrderData()
        .then(({
          data
        }) => {
          let {
            code,
            message,
            result
          } = data;
          if (code === CODE.succ) {
            let list = result.list;
            let allOrders = list.map(order => {
              let [confirmOrderDate, confirmOrderTime] = order.createTime.split(" ");
              return {
                orderCode: order.orderCode,
                goodsName: order.describe,
                goodsPrice: order.totalAmount,
                imageUrl: order.iconUrl,
                location: order.merchantName,
                terminalCode: order.terminalCode,
                tradeResult: this.formatResult(order.status),
                payStatus: this.formatStatus(order.status),
                payWay: order.payWay,
                payIcon: this.getPayIcon(order.payWay),
                confirmOrderDate,
                confirmOrderTime
              }
            })
            let orderListKey = 'orderAreas[' + navBarIndex + '].data',
              currentPageKey = 'orderAreas[' + navBarIndex + '].page.currentPage',
              isLastPageKey = 'orderAreas[' + navBarIndex + '].page.isLastPage',
              isLoadingOrder ='orderAreas[' + navBarIndex + '].page.isLoadingOrder',
              orderList = method === 'load' ? orderAreas[navBarIndex].data : []
            // console.log(this.data.orderAreas[navBarIndex].page.currentPage)
            // console.log("next: " + result.nextPage)
            // console.log(result)
            this.setData({
              [orderListKey]: orderList.concat(allOrders),
              [currentPageKey]: result.nextPage,
              [isLoadingOrder]:false,
              [isLastPageKey]: result.isLastPage
            }, () => {
              callback && callback()
            })

          } else {
            errorMsg(message);
            this.setData({
              ['orderAreas[' + navBarIndex + '].page.isLoadingOrder']: false
            })
          }
        })
    }

  },
  formatResult(status) {
    switch (status) {
      case 'PAYED':
        return 'success'
      case 'NEW':
        return 'new'
    }
  },
  formatStatus(status) {
    switch (status) {
      case 'PAYED':
        return '已支付'
      case 'NEW':
        return '交易失败'
    }
  },
  getPayIcon(payWay) {
    switch (payWay) {
      case 'WECHAT_H5_JS':
        return '/images/order/icon-Wechat@3x.png'
      case 'ALIPAY_WAPPAY':
        return '/images/order/icon-zhifubao@3x.png'
      default:
        return '/images/order/tradefail.png'
    }
  },
  loadOrderData() {
    return new Promise((resolve, reject) => {
      let navBarIndex = this.data.navBarIndex
      ajax({
        path: URL.orderUserMerchant,
        method: 'POST',
        data: {
          timestamp: Date.now(),
          value: {
            // merchant: {
            //   code: app.globalData.merchant.code
            // },
            orderLocation: [],
            statusCode: this.data.navBarIndex,
            timeSlot: {
              dateBegin: "",
              dateEnd: ""
            }
          },
          page: this.data.orderAreas[navBarIndex].page
        },
        success: res => {
          resolve(res)
        },
        error: e => {
          reject(e)
        },
        complete: () => {
          wx.hideLoading()
        }
      })
    })
  },
  ReachBottom() {
    let {
      orderAreas,
      navBarIndex
    } = this.data
    if (!orderAreas[navBarIndex].page.isLastPage) {
      this.setOrderData('load')
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.firstLoadData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let {
      navBarIndex
    } = this.data
    let pageKey = 'orderAreas[' + navBarIndex + '].page.currentPage';
    this.setData({
      [pageKey]: 1
    })
    this.setOrderData('refresh', () => {
      wx.showToast({
        title: '数据刷新成功！'
      })
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})