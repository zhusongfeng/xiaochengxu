// pages/overdueInventory/overdueInventory.js
let { HOST, URL, CODE } = require('../../utils/api.js')
const app = getApp()
const { ajax, errorMsg } = app
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarTitles: ['警报详情', '警报总计'],
    expiredDetail: [],
    detailPageIndex:1,//分页数据多少页
    detailPageTotal:1,//总共页数
    countPageIndex:0,
    countPageTotal:0,
    inventoryTotal: [],
    isLoading:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    ajax({
      path: URL.expiredDetail,
      method: 'POST',
      data: {
        timestamp: Date.now(),
          "page": {
            "currentPage": 1,
            "pageSize": 10
          }
      },
      success: ({ data }) => {
        
        if (data.code === CODE.succ) {
          this.setData({
            detailPageTotal:data.result.pages
          })   
          let expiredDetail= data.result.list.map(item => {
            // item.merchantName = app.globalData.merchant.name
            return item
          })

          this.setData({
            expiredDetail
          })

        } else {
          errorMsg(data.message)
        }
      }
    })
    ajax({
      path: URL.expiredCount,
      method: 'POST',
      data: {
        timestamp: Date.now(),
        "page": {
          "currentPage": 1,
          "pageSize": 10
        }
      },
      success: ({ data }) => {

        if (data.code === CODE.succ) {
          this.setData({
           countPageTotal: data.result.pages
          })
          let result = data.result.list.map(item => {
            // item.merchantName = app.globalData.merchant.name
            return item
          })

          this.setData({
            inventoryTotal:result
          })

        } else {
          errorMsg(data.message)
        }
      }
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
  console.log(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
 
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  detailTolower(){
    if (this.data.detailPageIndex >= this.data.detailPageTotal) {
      wx.showToast({
        title: '没有更多数据了',
        icon: "none"
      })
      return
    }
    this.setData({
      detailPageIndex: this.data.detailPageIndex + 1,
      isLoading: true
    })
    //console.log(this.data.detailPageIndex)
    ajax({
      path: URL.expiredDetail,
      method: 'POST',
      data: {
        timestamp: Date.now(),
        "page": {
          "currentPage": this.data.detailPageIndex,
          "pageSize": 10
        }
      },
      success: ({ data }) => {
        //console.log(data.result)
        this.setData({
          isLoading: false
        })
        if (data.code === CODE.succ) {
           
          let expiredDetail = data.result.list.map(item => {
            // item.merchantName = app.globalData.merchant.name
            return item
          })

          this.setData({
            expiredDetail: [...this.data.expiredDetail, ...expiredDetail]
          })
        
        } else {
          errorMsg(data.message)
        }
      }
    })
  },
  totalTolower(){
 
    if (this.data.countPageIndex >= this.data.countPageTotal) {
      wx.showToast({
        title: '没有更多数据了',
        icon:"none"
      })
      return
    }
    this.setData({
      countPageIndex: this.data.countPageIndex + 1,
      isLoading: true
    })
    //console.log(this.data.detailPageIndex)
    ajax({
      path: URL.countDetail,
      method: 'POST',
      data: {
        timestamp: Date.now(),
        "page": {
          "currentPage": this.data.countPageIndex,
          "pageSize": 10
        }
      },
      success: ({ data }) => {
        //console.log(data.result)
        this.setData({
          isLoading: false
        })
        if (data.code === CODE.succ) {

          let result = data.result.list.map(item => {
            // item.merchantName = app.globalData.merchant.name
            return item
          })

          this.setData({
            inventoryTotal: [...this.data.inventoryTotal, ...result]
          })

        } else {
          errorMsg(data.message)
        }
      }
    })
  }
})