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
    isOperateDialogShow: false,
    machines: [
      // {
      //   terminalCode: 'NO.10015',
      //   hotelName: '汉庭酒店(杭州滨文路店)',
      //   roomPosition: '1208号房间/工厂大门左侧',
      //   imageUrl: '/images/machine/icon_machine@3x.png',
      //   lastSupplyDate: '2018.01.21',
      //   status: {
      //     wifi: true,
      //     temperature: false,
      //   },
      //   count: {
      //     stockoutCount: 0,
      //     expiredGoodsWarnCount: 0
      //   }
      // },
    ],
    page: {
      currentPage: 0,
      pageSize: 10,
      isLastPage: false
    },
    isLoading: false
  },
  myInput(e) {

    let { value } = e.detail;
    this.setData({
      queryValue: value
    })
  },
  queryMachines() {
    let page = {
      currentPage: 0,
      pageSize: 10,
      isLastPage: false
    }
    this.setData({
      page,
      machines: []
    })
    this.getMachines()
  },
  getMachines() {
    if (this.data.page.isLastPage) {
      return wx.showToast({
        title: '没有更多数据了',
        icon: 'none'
      })
    }
    this.setData({
      isLoading: true,
      [`page.currentPage`]: this.data.page.currentPage + 1
    })
    return new Promise((resolve, reject) => {
      ajax({
        path: URL.replenishmentMachines,
        method: 'POST',
        data: {
          timestamp: Date.now(),
          "page": {
            "currentPage": this.data.page.currentPage,
            "pageSize": this.data.page.pageSize
          },
          "value": this.data.queryValue
        },
        success: ({ data }) => {
          if (data.code === CODE.succ) {
            let machines = data.result.list.map(machine => {
              let { statistics, status, terminal, merchant } = machine;
              status = status || {}
              return {
                terminalCode: terminal.terminalCode,
                hotelName: merchant.name,
                roomPosition: terminal.roomNum || '暂无具体房间信息',
                imageUrl: '/images/machine/icon_machine@3x.png',
                status: {
                  lastSupplyDate: statistics.lastSupplyDate || '暂无',
                  wifi: status.networkStatus === null ? false : status.networkStatus,
                  temperature: status.temperature === null ? false : status.temperature,
                  lightStatus: status.lightStatus === null ? false : status.lightStatus,
                  tempStatus: status.tempStatus === null ? false : status.tempStatus
                },
                count: {
                  stockoutCount: statistics.stockoutCount,
                  expiredGoodsWarnCount: statistics.expiredGoodsWarnCount
                },
                updateData: {
                  "terminalCode": machine.terminal.terminalCode,
                  "merchantCode": machine.merchant.code,
                  "terminalType": machine.terminal.terminalType,
                  "mac": machine.terminal.mac,
                  "hatchCount": machine.terminal.hatchCount,
                  "qrCode": machine.terminal.terminalCode.qrCode,
                  "safeCode": machine.terminal.safeCode,
                  "roomNum": machine.terminal.roomNum
                }
              }
            })

            this.setData({
              machines: this.data.machines.concat(machines),
              ['page.currentPage']: data.result.nextPage,
              ['page.isLastPage']: data.result.isLastPage,
              isLoading: false
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

  loadMachines() {

    this.getMachines()
  }
  ,
  fillAllMachine() {
    this.setData({
      isOperateDialogShow: true
    })
  }
  ,
  executeCommand() {
    ajax({
      path: URL.allReplenish,
      method: 'POST',
      data: {},
      success: ({ data }) => {
        if (data.code === CODE.succ) {
          wx.showToast({
            title: '成功',
            icon: 'none'
          })
          this.setData({
            isOperateDialogShow: false
          })
        } else {

          this.setData({
            isOperateDialogShow: false
          })
          errorMsg(data.message)
        }
      }
    })
  },
  closeDialog() {
    this.setData({
      isOperateDialogShow: false
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
  onShow: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.queryMachines()
      .then(() => {
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