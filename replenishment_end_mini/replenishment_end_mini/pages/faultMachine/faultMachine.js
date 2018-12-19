const app = getApp()
const {URL, CODE} = require('../../utils/api.js')
const {ajax, errorMsg} = app
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue: '',//查询的关键词
    faultMachine: [],
    currentPage: 1,
    pageSize: 10,
    totalPage:0,
    loadMode: '',   // String (load | refresh) 上拉加载更多 或者 下拉刷新
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    ajax({
      path: URL.breakdownList,
      method: 'POST',
      data: {
        timestamp: Date.now(),
        page: {
          currentPage:this.data.currentPage,
          pageSize:this.data.pageSize
        },
        "value":this.data.searchValue
      },
      success: ({ data }) => {
       
        if (data.code === CODE.succ) {
          const result = data.result
         // console.log(result)
          let machines = data.result.list.map(machine => {
            let { terminalBreakDownRecord,status,terminal,merchant} = machine;
            return {
              terminalCode: terminal.terminalCode,
              hotelName: merchant.name,
              roomPosition: terminal.roomNum || '暂无具体房间信息',
              imageUrl: '/images/machine/icon_machine@3x.png',
              createDate: terminalBreakDownRecord && terminalBreakDownRecord.createDate ? terminalBreakDownRecord.createDate:'',
              status: {
                wifi: status && status.networkStatus ? status.networkStatus : '',
                temperature: status && status.temperature ? status.temperature : ''
              },
              count: {
                
                
              },
              updateData: {
                "terminalCode":machine.terminal.terminalCode,
                "merchantCode":machine.merchant.code,
                "terminalType":machine.terminal.terminalType,
                "mac":machine.terminal.mac,
                "hatchCount":machine.terminal.hatchCount,
                "qrCode":machine.terminal.terminalCode.qrCode,
                "safeCode":machine.terminal.safeCode,
                "roomNum": machine.terminal.roomNum
              }
            }
          })
          this.setData({
            totalPage: result.pages,
            currentPage: this.data.currentPage + 1,
            faultMachine: this.data.faultMachine.concat(machines)
          })
         
        } else {
          errorMsg(data.message)
        }

      },
      error: e => {
        console.log(e)
      }
    })
  },
  goLink: (e)=>{
/*    console.log(e.currentTarget.dataset.machine)
      let url = "/pages/machineDetails/machineDetails?machine=" + JSON.stringify(e.currentTarget.dataset.machine)
      wx.navigateTo({
        url
      })*/
  }
  ,
  getBreakDownMachines(){
    if(this.data.currentPage>this.data.totalPage){
      wx.showToast({
        title: '没有更多数据啦',
        icon:'none'
      })
      return
    }
    wx.showLoading({
      title: '加载中',
    })
      return new Promise((resolve,reject)=>{
        ajax({
          path: URL.breakdownList,
          method: 'POST',
          data: {
            timestamp: Date.now(),
            page: {
              currentPage:this.data.currentPage,
              pageSize: 10
            },
            value:this.data.searchValue
          },
          success: ({ data }) => {

            if (data.code === CODE.succ) {
              const result = data.result
              let machines = data.result.list.map(machine => {
                let { terminalBreakDownRecord, status, terminal, merchant } = machine;
                return {
                  terminalCode: terminal.terminalCode,
                  hotelName: merchant.name,
                  roomPosition: terminal.roomNum || '暂无具体房间信息',
                  imageUrl: '/images/machine/icon_machine@3x.png',
                  createDate: terminalBreakDownRecord && terminalBreakDownRecord.createDate ? terminalBreakDownRecord.createDate : '',
                  status: {
                    wifi: status && status.networkStatus ? status.networkStatus : '',
                    temperature: status && status.temperature ? status.temperature : ''
                  },
                  count: {


                  }
                }
              })
              this.setData({
                currentPage: this.data.currentPage + 1,
                faultMachine: this.data.faultMachine.concat(machines)
              })
              wx.hideLoading()
              resolve()
            } else {
              errorMsg(data.message)
            }

          },
          error: e => {
            reject(e)
          }
        })
      })
  },
  myInput(e) {
   
    let { value } = e.detail;
    console.log(value)
    this.setData({
      searchValue: value
    })
  },
  queryMachines() {

    this.setData({
      faultMachine: [],
      currentPage: 1
    })
    this.getBreakDownMachines()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  

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