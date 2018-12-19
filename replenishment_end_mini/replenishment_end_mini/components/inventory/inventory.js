// components/inventory/inventory.js
let { URL, CODE } = require('../../utils/api.js')
const app = getApp()
const { ajax, errorMsg } = app
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: String,
    navBarTitles: {
      type: Array,
      default: ['补货详情', '补货总计']
    },
    loadingShow:{
      type:Boolean,
      value:false
    },
    inventoryDetails: {
      type: Array,
      default: []
    },
    inventoryTotal: {
      type: Array,
      default: []
    }
   
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex: 0,
  },
  attached(){
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toggleNav(e){
      let index = e.target.dataset.index;
      if (typeof index === 'number') {
        if (this.data.currentIndex !== index) {
          this.setData({
            currentIndex: index
          });
        }
      }
    },
    detailFunction(){
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('detailTolower' ,myEventDetail, myEventOption)
    },
    totalFunction(){
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('totallTolower', myEventDetail, myEventOption)
    },
    //开始补货按钮，更换商品按钮
    startReplenishment(e) {
      let roomNum = e.target.dataset.roomnum;
      let formUrl = e.target.dataset.formurl;   // 为之后设备详情判断来源值
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
            path: URL.machineDetail,
            method: 'POST',
            data: {
              "timestamp": Date.now(),
              "value": {
                "qrCode": qr
              }
            },
            success: ({ data }) => {
              if (data.code === CODE.succ) {
                const result = data.result.terminal;
                result.formUrl = formUrl;
                const num = data.result.terminal.roomNum;
                if(roomNum!=num){
                    wx.showToast({
                        title: '请更换房间',
                        duration: 2000
                    })
                }
                else{
                    let url = "/pages/machineDetails/machineDetails?machine=" + JSON.stringify(result)
                    wx.navigateTo({
                        url
                    })
                }


              } else {
                errorMsg(data.message)
                return
              }
            }
          })
        }
      })
    }
  }
})
