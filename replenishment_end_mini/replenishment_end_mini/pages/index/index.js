// pages/index/index.js
let {URL, CODE} = require('../../utils/api.js')
const app = getApp()
const { ajax, errorMsg} = app
Page({

  /**
   * 页面的初始数据
   */
  data: {
    featureModules: [
      {
        label: '补货清单',
        url: '/pages/replenishmentInventory/replenishmentInventory',
        bgColor: 'rgb(254, 198, 165)',
        imageUrl: '/images/index/icon_replenishmentmachine@3x.png',
        counts:0,
        handleClick() {
          console.log('scan')
        }
      },
      {
        label: '故障机器',
        url: '/pages/faultMachine/faultMachine',
        bgColor: 'rgb(172, 221, 238)',
        bottomText: '',
        imageUrl: '/images/index/icon_faultmachine@3x.png',
        counts: 0
      },
      {
        label: '保质期警报',
        url: '/pages/overdueInventory/overdueInventory',
        bgColor: 'rgb(250, 162, 168)',
        imageUrl: '/images/index/icon_caution@3x.png',
        counts: 0
      },
      {
        label: '扫一扫',
        bgColor: 'rgb(165, 198, 246)',
        imageUrl: '/images/index/icon_scan@3x.png',
        handleClick(){
          console.log('scan')
        }
      },
    ],
    merchant: {},
    allCount: 0,
    formUrl:'',         //跳转来源
  },
  navigateToTarget(e){
    var that = this;
    let url = e.currentTarget.dataset.url;
    let formUrl = e.currentTarget.dataset.formurl;
      this.setData({
          formUrl
      })
    url ? wx.navigateTo({ url }) : wx.scanCode({
      fail: function (res) {
        wx.showToast({
          title: '未扫描到数据',
          duration: 2000
        })
      },
      success: (res) => {
        
        const qr = res.result.split('/qr/')[1]
        ajax({
          path: URL.qrMachine+qr,
          method:'GET',
          success: ({ data }) => {
                console.log(data)
            if (data.code === CODE.succ) {
              const result = data.result;
                let obj={      
                terminalCode: result.terminal.terminalCode,
                merchantCode:result.merchant.code,
                isOnline: result.terminal.isOnline,
                machineQr:qr,
                formUrl:formUrl,
                merchantName: result.merchant.name,
                roomPosition: result.terminal.roomNum || '暂无具体房间信息',
                imageUrl: '/images/machine/icon_machine@3x.png',
                lastSupplyDate: result.statistics.lastSupplyDate || '暂无',
                status: {
                  wifi: result.status.networkStatus||'',
                  temperature: result.status.temperature||'',
                  lightStatus: result.status.lightStatus||'',
                  tempStatus: result.status.tempStatus||''
                },
                count: {
                  stockoutCount: result.statistics.stockoutCount,
                  expiredGoodsWarnCount: result.statistics.expiredGoodsWarnCount
                },
                updateData: {
                  "terminalCode": result.terminal.terminalCode,
                  "merchantCode": result.merchant.code,
                  "terminalType": result.terminal.terminalType,
                  "mac": result.terminal.mac,
                  "hatchCount": result.terminal.hatchCount,
                  "qrCode": result.terminal.terminalCode.qrCode,
                  "safeCode": result.terminal.safeCode,
                  "roomNum": result.terminal.roomNum
                }
                }
              //console.log(data.result)
              let url = "/pages/machineDetails/machineDetails?machine=" + JSON.stringify(obj)
                  
              wx.navigateTo({
                url
              })
            } else {
              errorMsg(data.message)
              return
            }
          }
        })
      }
    })
  },
  //设备绑定/解绑
  machineBind(){
    wx.scanCode({
      fail: function (res) {
        wx.showToast({
          title: '未扫描到数据',
          duration: 2000
        })
      },
      success: (res) => {

        const qr = res.result.split('/qr/')[1]
        ajax({
          path: URL.machineDetail ,
          method: 'POST',
          data:{
            "timestamp": Date.now(),
            "value": {
              "qrCode": qr
            }
          },
          success: ({ data }) => {
            if (data.code === CODE.succ) {

              const result = data.result
              let url = "/pages/machineBind/machineBind?machine=" + JSON.stringify(result)
              wx.navigateTo({
                url
              })

            } else {
              errorMsg(data.message)
              return
            }
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserMsg();
    this.getUserMerchant()
      .then(() => {
        this.getReplenishStatistics()
        this.getBreakdownStatistics()
        this.getExpTimeStatistics()
        this.getAllMachinesStatistics()
        // 判断是否超过过期时间
        // let allMachinesCount = wx.getStorageSync('allMachinesCount')
        // console.log(allMachinesCount)
        // if (allMachinesCount && Date.now() < JSON.parse(allMachinesCount).expired) {
        //   this.setData({
        //     allCount: JSON.parse(allMachinesCount).count
        //   })
        // } else {
        //   this.getAllMachinesStatistics()
        // }
      })
  },
  getUserMsg(){
    ajax({
      path: URL.userInfo,
      success: ({ data }) => {
        if (data.code === CODE.succ) {
          app.globalData.userInfo = data.result
        } else {
          errorMsg(data.message)
        }
      }
    })
  },
  getUserMerchant(){
    return new Promise((resolve, reject) => {
      ajax({
        path: URL.userMerchants,
        success: ({ data }) => {
          if (data.code === CODE.succ) {
            app.globalData.merchant = data.result[0]
            this.setData({
              merchant: data.result[0]
            })
            resolve()
          } else {
            errorMsg(data.message)
            reject()
          }
        }
      })
    })
  },
  getReplenishStatistics(){
    return new Promise((resolve, reject) => {
      ajax({
        path: URL.replenishStatistics,
        success: ({ data }) => {
          if (data.code === CODE.succ) {
            let key = 'featureModules[0].counts'
            this.setData({
              [key]: data.result
            })
          } else {
            errorMsg(data.message)
          }
          resolve();
        },
        error: e => {
          reject(e)
        }
      })
    })
  },
  getBreakdownStatistics() {
    return new Promise((resolve, reject) => {
      ajax({
        path: URL.breakdownStatistics,
        success: ({ data }) => {
          if (data.code === CODE.succ) {
            let key = 'featureModules[1].counts'
            this.setData({
              [key]: data.result
            })
          } else {
            errorMsg(data.message)
          }
          resolve()
        },
        error: e => {
          reject()
        }
      })
    })
  },
  getExpTimeStatistics(){
    return new Promise((resolve, reject) => {
      ajax({
        path: URL.expTimeStatistics,
        success: ({ data }) => {
          console.log(data)
          if (data.code === CODE.succ) {
            let key = 'featureModules[2].counts'
            this.setData({
              [key]: data.result
            })
          } else {
            errorMsg(data.message)
          }
          resolve();
        },
        error: e => {
          reject(e)
        }
      })
    })
  },
  getAllMachinesStatistics() {
    ajax({
      path: URL.allMachinesStatistics,
      success: ({ data }) => {
        const expired = 3 * 24 * 3600 * 1000  //机器总数存3天
        console.log(data)
        if (data.code === CODE.succ) {
          this.setData({
            allCount: data.result
          })
          let allMachinesCount = {
            count: data.result,
            expired: Date.now() + expired
          }
          wx.setStorage({
            key: 'allMachinesCount',
            data: JSON.stringify(allMachinesCount),
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
    let p1 = this.getReplenishStatistics()
    let p2 = this.getBreakdownStatistics()
    let p3 = this.getExpTimeStatistics()
    Promise.all([p1, p2,p3]).then(() => {
      wx.stopPullDownRefresh()
      wx.showToast({
        duration: 1000,
        title: '刷新成功！',
      })
    })
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
  
  }
})