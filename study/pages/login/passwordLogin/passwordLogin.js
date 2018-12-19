// pages/component/login/passwordLogin/passwordLogin.js
const {HOST, URL} = require('../../../utils/api');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone: '',
        password: '',
    },
    //获取手机号
    phoneInput: function (e) {
        this.setData({
            phone: e.detail.value
        })
    },
    account_val:function(e){
        this.setData({
            phone: e.detail.value.replace(/\s+/g, "")
        })
    },
    //获取密码
    passwordInput: function (e) {
        this.setData({
            password: e.detail.value
        })
    },
    loginIn: function (e) {
        let self = this;
        let openid = app.globalData.openid;
        if (!openid) {
            wx.login({
                success: function (res) {
                    if (res.code) {
                        wx.request({
                            url: HOST + URL.openId,
                            method: 'POST',
                            header: {
                                'Authorization': 'Basic dGVzdDpwYXNzd2Q=',
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            data: {
                                code: res.code,
                            },
                            success: (res) => {
                                app.globalData.openid = res.data.openid;
                                self.login();
                            },
                            error(e) {
                                console.log('error' + e)
                            },
                        })
                    }
                }
            })
        }else{
            self.login();
        }
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
    // 登录
    login: function (){
        let self = this;
        let phone = self.data.phone;
        let password = self.data.password;
        if (!(/^1[3456789]\d{9}$/.test(phone))) {
            wx.showToast({ title: '请输入正确的手机号码', icon: 'none', duration: 2000 })
            return;
        }
        if (!password) {
            wx.showToast({ title: '请输入登录密码', icon: 'none', duration: 2000 })
            return;
        }
        wx.request({
            url: HOST + URL.login,
            method: 'POST',
            header: {
                'Authorization': 'Basic dGVzdDpwYXNzd2Q=',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                phone: phone,
                code: code,
                phoneCode: phoneCode,
                openid: app.globalData.openid,
            },
            success: (res) => {
                console.log(res)
                if(res.data.status){
                    wx.showToast({title: "登录成功！", icon: 'none', duration: 2000 })
                    //登录成功跳转到首页
                    /* wx.switchTab({
                         url: '/pages/index/index',
                     })*/
                }else {
                    wx.showToast({title:res.data.message,icon:'none',duration:2000});
                    return
                }
            },
            error(e) {
                console.log('error' + e)
            },
        })
    }
})