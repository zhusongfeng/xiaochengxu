// pages/machineBind/machineBind.js
let { URL, CODE } = require('../../utils/api.js')
const app = getApp()
const { ajax, errorMsg } = app
Page({

  /**
   * 页面的初始数据
   */
  data: {
    machineInfo:{},
    merchant:[],
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let machineInfo = JSON.parse(options.machine);
    let username = app.globalData.userInfo.username;
    console.log(machineInfo);
    if (!machineInfo.terminal || !machineInfo.terminal.merchantCode){
      machineInfo.isbind = false;
      machineInfo.isclear = false;
      ajax({
        path: URL.allMerchants,
        method:"POST",
        data: {
          "timestamp": Date.now(),
          "page": {
            "currentPage": 1,
            "pageSize": 10000
          }
        },
        success: ({ data }) => {
          if (data.code === CODE.succ) {
            this.setData({
              merchant: data.result.list,
              'machineInfo.merchantCode':data.result.list[0].code
            })
          } else {
            errorMsg(data.message)
          }
        }
      })
    }else{
      machineInfo.isbind = true;
      machineInfo.isclear=true;
    }
    let machine = {
      user: username,
      terminalType: machineInfo.terminal && machineInfo.terminal.terminalType,
      terminalCode: machineInfo.terminal && machineInfo.terminal.terminalCode,
      merchantCode: machineInfo.terminal && machineInfo.terminal.merchantCode,
      roomNum: machineInfo.terminal && machineInfo.terminal.roomNum,
      merchantName: machineInfo.merchant && machineInfo.merchant.name,
      isclear: machineInfo.isclear,
      isbind: machineInfo.isbind 
    }
    
    this.setData({
      machineInfo: machine
    })
  },
  formSubmit (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let url;
    this.data.machineInfo.isbind ? url = URL.machineCancel : url = URL.machineBind;
    
    console.log(Date.now(), this.data.machineInfo)
    ajax({
      method: 'POST',
      path: url,
      data:{
        timestamp: Date.now(),
        value: {
          terminalCode: this.data.machineInfo.terminalCode,
          merchantCode: this.data.machineInfo.merchantCode,
          cleanStock: this.data.machineInfo.isclear
        }
      },
      success: ({ data }) => {
        if (data.code === CODE.succ) {
          wx.reLaunch({
            url: '/pages/index/index',
          })
        } else {
          errorMsg(data.message)
        }
      }
    })
  },
  cancelBind () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)

    this.setData({
      index: e.detail.value,
      'machineInfo.merchantCode': this.data.merchant[e.detail.value].code
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
    wx.stopPullDownRefresh();
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