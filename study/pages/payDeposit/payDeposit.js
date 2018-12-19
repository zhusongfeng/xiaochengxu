const {HOST, URL} = require('../../utils/api');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ecardFee: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        let self = this;
        wx.request({
            // url: 'https://www.shuduier.com' + ' ',
            url: HOST + URL+' ',
            method: 'POST',
            header: {
                'Authorization': 'Basic dGVzdDpwYXNzd2Q=',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                openid: app.globalData.openid
            },
            success: function (res) {
                self.setData({
                    hiddenLoading: true,
                });
                if (res.data.status) {
                    self.setData({
                        ecardFee: res.data.fee
                    });
                } else {
                    wx.showToast({
                        title: res.data.message,
                    })
                }
            }
        })
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

    wxpay: function () {
        let self = this;
        self.setData({
            hiddenLoading: false,
        });

        wx.request({
            // url: app.globalData.server + '/api/v5/mini/miniwxpay',
            url: HOST + URL.miniwxpay,
            method: 'POST',
            header: {
                'Authorization': 'Basic dGVzdDpwYXNzd2Q=',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                openid: app.globalData.openid
            },
            success: function (res) {
                self.setData({
                    hiddenLoading: true,
                });
                wx.requestPayment({
                    'timeStamp': res.data.timeStamp,
                    'nonceStr': res.data.nonceStr,
                    'package': 'prepay_id=' + res.data.prepay_id,
                    'signType': 'MD5',
                    'paySign': res.data.sign,
                    'success': function (res) {
                        self.setData({
                            hiddenLoading: false,
                        });
                        wx.request({
                            // url: app.globalData.server + '/api/v4/ecard/payOk',
                            url: HOST + URL.payOk,
                            method: 'POST',
                            header: {
                                'Authorization': 'Basic dGVzdDpwYXNzd2Q=',
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            data: {
                                openid: app.globalData.openid
                            },
                            success: function (res) {
                                self.setData({
                                    hiddenLoading: true,
                                });
                                wx.redirectTo({
                                    url: "../paySuccess/paySuccess"
                                })
                            }
                        })
                    },
                    'fail': function (res) {
                    }
                })
            }
        })
    },

    zhima: function () {
        wx.navigateTo({
            url: '../myBorrow/myBorrow'
        })
    }
})