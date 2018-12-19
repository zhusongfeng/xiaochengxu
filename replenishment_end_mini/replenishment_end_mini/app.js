//app.js
const { HOST } = require('/utils/api.js');
//数据统计
var mta= require('/utils/mta_analysis.js');

App({
    onLaunch: function () {
        mta.App.init({
            "appID":"500649087",
            "eventID":"500649089",
            "statPullDownFresh":true,
            "statShareApp":true,
            "statReachBottom":true
        });
        // 获取用户信息
        wx.getSetting({

            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },
    globalData: {
        userInfo: null,
        wxUserInfo: null,
        merchant: {}
    },
    ajax: ({
               path,
               method = 'GET',     // String ('GET | 'POST')
               data,
               dataType,
               header,
               responseType,
               success,
               error,
               complete
           }) => {
        wx.request({
            url: HOST + path,
            method,
            data,
            header: Object.assign({}, { 'Cookie': wx.getStorageSync('cookie') }, header),
            dataType,
            responseType,
            success: (res) => {
                if (res.data.code === 'LP9995') {
                    wx.setStorageSync('expired', Date.now())
                    wx.redirectTo({
                        url: '/pages/login/login',
                    })
                } else {
                    success(res)
                }
            },
            complete,
            fail: error
        })
    },
    errorMsg: msg => {
        wx.showToast({
            icon: 'none',
            title: msg || '获取数据失败！',
        })
    },
    //转发
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '自定义转发标题',
            path: '/pages/index/index',
            imageUrl:'/images/523.png'
        }
    }
})