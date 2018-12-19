const app = getApp()
const { URL, CODE } = require('../../utils/api.js')
const ajax = app.ajax
const errorMsg = app.errorMsg
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgImgUrl: '../../images/myself/avatarbackground.png',
    userInfo: '',
    isShowDialog:false,
    navigatorList: [
      {
        url: '/pages/orderCenter/orderCenter',
        iconUrl: '/images/myself/icon_orderform@3x.png',
        name: '订单列表',
        openType: 'switchTab'
      },
      {
        url: '/pages/allMachine/allMachine',
        iconUrl: '/images/myself/icon_equipment@3x.png',
        name: '设备列表'
      },
      {
        url: '',
        iconUrl: '/images/myself/icon_success@3x.png',
        name: '实名认证',
        extraContent: '已认证'
      },
      {
        url: '/pages/feedback/feedback',
        iconUrl: '/images/myself/icon_objection@3x.png',
        name: '意见反馈'
      },
    ],
    userCount:''
  },
  logout(){
    ajax({
      path: URL.logout,
      method: 'GET',
      dataType: 'json',
      success: ({data}) => {
        if (data.code === CODE.succ) {
          // 退出登录 清空数据
          app.globalData.userInfo = null
          app.globalData.merchant = null
          wx.removeStorageSync('cookie')
          wx.removeStorageSync('expired')
          wx.removeStorageSync('allMachinesCount')
          wx.reLaunch({
            url: '/pages/login/login',
          })
        } else {
          errorMsg(data.message)
        }

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: JSON.parse(wx.getStorageSync('wxUserInfo'))
    });
    let _self = this;
    wx.getStorage({
      key: 'currentUser',
      success: function (res) {
        _self.setData({ userCount: res.data });
      },
      fail: function () {
        console.log("还没有当前用户名记录");
      }
    })
  },
  // 修改密码
  formSubmit: function (e) {
    // console.log('form发生了submit事件，携带数据为：', e.detail.value);
    console.log(e);
    if(e.detail.value.originPassword === ""){
      wx.showToast({
        title: '请输入原密码',
        icon: 'none'
      });
      return
    }
    if(e.detail.value.newPassword && e.detail.value.surePassword===e.detail.value.newPassword){
      let dataObj = {
          timestamp: (new Date()).getTime(),
          value: {
            account: this.data.userCount,
            password: e.detail.value.originPassword,
            newPassword: e.detail.value.newPassword
          }
        };
      let filter = JSON.stringify(dataObj);
      
      ajax({
        path: URL.resetPassword,
        method: 'POST',
        data: filter,
        dataType: 'json',
        success: ({
          data
        }) => {

          if (data.code === CODE.succ) {
            wx.showToast({
              title: '操作成功',
              icon: 'none'
            });
            setTimeout(() => {
              this.logout();
            }, 1000)

          } else {
            errorMsg(data.message)
          }
        },
        error: e => {
          console.log(e)
        }
      })
    }else{
      wx.showToast({
        title: '请输入新密码并确认密码',
        icon: 'none'
      });
      return
    }
  }, 
  //打开修改密码弹窗
  password:function(){
    this.setData({
      isShowDialog:true
    })
  },
  //关闭修改密码弹窗
  closeDialog: function () {
    this.setData({
      isShowDialog: false
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
  
  }
})