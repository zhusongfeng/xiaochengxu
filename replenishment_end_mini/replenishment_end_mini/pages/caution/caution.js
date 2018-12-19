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
      currentPage: 1,
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
  getMachines() {
    return new Promise((resolve, reject) => {
      ajax({
        path: URL.expiredMachines,
        method: 'POST',
        data: {
          timestamp: Date.now(),
          "page": {
            "currentPage": 1,
            "pageSize": 20
          },
          "value":""
        },
        success: ({ data }) => {
          if (data.code === CODE.succ) {
            
            let machines = data.result.list.map(machine => {
              let { statistics, status, terminal } = machine;
              return {
                terminalCode: terminal.terminalCode,
                hotelName: app.globalData.merchant.name,
                roomPosition: terminal.roomNum || '暂无具体房间信息',
                imageUrl: '/images/machine/icon_machine@3x.png',
           
                status: {
                  wifi: status&&status.networkStatus ? status.networkStatus:'',
                  temperature: status && status.temperature?status.temperature:'',
                  lastSupplyDate: (machine.statistics && machine.statistics.lastSupplyDate) ? machine.statistics.lastSupplyDate : '暂无'
                },
                count: {
                  stockoutCount: machine.statistics?machine.statistics.stockoutCount:'暂无',
                  expiredGoodsWarnCount: machine.statistics?machine.statistics.expiredGoodsWarnCount:'暂无'
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
              machines,
              ['page.currentPage']: data.result.nextPage,
              ['page.isLastPage']: data.result.isLastPage
            })
          } else {
            errorMsg(data.message)
          }
          resolve()
        },
        error: e => {
          reject(e)
        }
      })
    })
  },
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
    this.setData({
      ['page.currentPage']: 1
    })
    this.getMachines().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.page.isLastPage) {
      this.setData({
        isLoading: true
      })
      this.getMachines().then(() => {
        this.setData({
          isLoading: false
        })
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})