// pages/replenishmentInventory/replenishmentInventory.js
const { HOST, URL, CODE } = require('../../utils/api.js')
const app = getApp()
const ajax = app.ajax
const errorMsg = app.errorMsg
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBar: ['补货详情', '补货总计'],
    inventoryDetails: [],  // 补货清单查询
    inventoryTotal: [],   //补货商品总计
    isLoading:false,
    detailPageIndex: 1,//分页数据多少页
    detailPageTotal: 1,//总共页数
    countPageIndex: 1,
    countPageTotal: 1,
    aaa:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self=this;
    ajax({
      path: URL.replenishmentCount,
      method: 'POST',
      data: {
        timestamp: Date.now(),
          "page": {
            "currentPage": this.data.countPageIndex,
            "pageSize": 15
          },
          value:''
      },
      success: ({data}) => {
      //  console.log(data)
       if (data.code === CODE.succ) {
        let inventoryTotal = data.result.list.map(item =>{
        return {...item,hotelName:'品类'}}
        )
         //console.log(data.result.lastPage)
          self.setData({
            countPageTotal: data.result.pages,
            inventoryTotal: data.result.list
            
          })
        } else {
          errorMsg(data.message)
        }
      }
    })
    ajax({
      // path: URL.replenishmentDetail,//以前的api，换成pc端的api
      path: URL.replenishmentInventory,
      method: 'POST',
      data: {
        timestamp: Date.now(),
        "page": {
          "currentPage": 1,
          "pageSize": 10
        },
      },
      success: ({ data }) => {
        //  console.log(data)
        if (data.code === CODE.succ) {

          this.setData({
            inventoryDetails: data.result.list,
            detailPageTotal: data.result.pages || this.data.detailPageTotal
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
  detailTolower() {
    console.log(this.data.detailPageIndex, this.data.detailPageTotal)
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
      path: URL.replenishmentInventory,
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

          let inventoryDetails = data.result.list;
          this.setData({
            inventoryDetails: [...this.data.inventoryDetails, ...inventoryDetails],
            detailPageTotal: data.result.pages
          })
      

        } else {
          errorMsg(data.message)
        }
      }
    })
  },
  countTolower() {
   
    if (this.data.countPageIndex >= this.data.countPageTotal) {
      wx.showToast({
        title: '没有更多数据了',
        icon: "none"
      })
      return
    }
    this.setData({
      countPageIndex: this.data.countPageIndex + 1,
      isLoading: true
    })

    console.log(this.data.isLoading)
    ajax({
      path: URL.replenishmentCount,
      method: 'POST',
      data: {
        timestamp: Date.now(),
        "page": {
          "currentPage": this.data.countPageIndex,
          "pageSize": 15
        }
      },
      success: ({ data }) => {
        //console.log(data.result)
        this.setData({
          isLoading: false
        })
        if (data.code === CODE.succ) {

          let result = data.result.list.map(item => {
            item.hotelName = app.globalData.merchant.name
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