// pages/replenishmentMachine/replenishmentMachine.js
let { HOST, URL, CODE } = require('../../utils/api.js')
const app = getApp()
const { ajax, errorMsg } = app
Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryValue: '',
    machines: [],
    page: {
      currentPage: 0,
      pageSize: 10,
      isLastPage: false
    },
    isLoading: false,
    loadTime:new Date().getTime()
  },
  myInput(e){
    
    let {value} = e.detail;
    this.setData({
      queryValue: value
    })
  },
  queryMachines(){
    let page={
      currentPage: 0,
        pageSize: 10,
          isLastPage: false
    }
    this.setData({
      page,
      machines:[]
    })
    this.getMachines()
  },
  getMachines(){
    if (this.data.page.isLastPage) {
      return wx.showToast({
        title: '没有更多数据了',
        icon: 'none'
      })
    }
    if (this.data.page.currentPage != 0 && (new Date().getTime()-this.data.loadTime)<1000) {
     return
    }
    this.setData({
      loadTime: new Date().getTime(),
      isLoading:true,
      [`page.currentPage`]:this.data.page.currentPage
    })
    return new Promise((resolve, reject) => {
      ajax({
        path: URL.userAllMachine,
        method: 'POST',
        data: {
          timestamp: Date.now(),
          "page": {
            "currentPage":this.data.page.currentPage,
            "pageSize":this.data.page.pageSize
          },
          "value":{
            "keywords":[this.data.queryValue]
          }
        },
        success: ({ data }) => {
          if (data.code === CODE.succ) {
            let machines = data.result.list.map(machine => {
             
             let  status = status || {}
              return {
                terminalCode:machine.terminalCode,
                hotelName:machine.merchantName,
                roomPosition:machine.roomNum || '暂无具体房间信息',
                imageUrl: '/images/machine/icon_machine@3x.png',
               
                status: {
                  "terminalCode": machine.terminalCode,
                  "merchantCode": machine.merchantCode,
                  "terminalType": machine.terminalType,
                  "mac": machine.mac,
                  "hatchCount": machine.hatchCount,
                  "qrCode": machine.qrCode,
                  "safeCode": machine.safeCode,
                  "roomNum": machine.roomNum,
                  "lastSupplyDate": machine.lastSupplyDate ? machine.lastSupplyDate:'暂无'
                }
              }
            })
         
            this.setData({
              machines:this.data.machines.concat(machines),
              ['page.currentPage']: data.result.nextPage,
              ['page.isLastPage']: data.result.isLastPage,
              isLoading:false
            })
          } else {
            errorMsg(data.message)
          }
          resolve('success')
        },
        error: e => {
          reject(e)
        }
      })
    })
  },
  loadMachines(){

    this.getMachines()
  }
  ,
  fillAllMachine(){
    ajax({
      path: URL.allReplenish,
      method: 'POST',
      data:{},
      success:({data})=>{
        if (data.code === CODE.succ) {
          wx.showToast({
            title: '成功',
            icon:'none'  
          })
        } else {
          errorMsg(data.message)
        }
      }
    })
  }
  ,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中'
    })
    this.getMachines().then(() => {
      wx.hideLoading()
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.queryMachines().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})