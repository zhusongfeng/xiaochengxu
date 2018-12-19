const {HOST, URL} = require('../../utils/api');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderno: '',
        name: '',
        idcard: '',
        phone: '',
        address: '',
        hiddenLoading: false,
    },
    // 拨打电话
    calling: function () {
        wx.makePhoneCall({
            phoneNumber: '400-128-0528',
            success: function () {
            },
            fail: function () {
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let self = this;
        this.setData({
            hiddenLoading: false,
        });

        wx.request({
            url: HOST + URL.ecardOrderInfo,
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
                    name: res.data.name,
                    cardno: res.data.cardno,
                    idcard: res.data.idno,
                    phone: res.data.mobile,
                    address: res.data.address,
                    orderno: res.data.ecardorderno
                })
            }
        })
    },
    //打开首页
    openIndex: function () {
        wx.navigateTo({
            url: '../index/index',
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

    }
});