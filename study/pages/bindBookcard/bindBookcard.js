const {HOST, URL} = require('../../utils/api');
const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        libArray: [],
        libIndex: 0,
        libIndexCode: '',
        cardno: '',
        cardpwd: '',
        hiddenLoading: true,
    },
    bindChangeLib: function (e) {
        let libIndex = e.detail.value;
        let libIndexCode = this.data.libArray[libIndex].code;
        this.setData({
            libIndex: libIndex,
            libIndexCode: libIndexCode,
        })
    },
    onLoad: function (e) {
        let self = this;
        let mac = e.mac;
        wx.request({
            url: HOST + URL.orgList,
            method: 'POST',
            header: {
                'Authorization': 'Basic dGVzdDpwYXNzd2Q=',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                let orgList = res.data.orgList;
                self.setData({
                    libArray: orgList,
                });

                if (mac != null && mac != '' && mac != 'undefined') {
                    wx.request({
                        url: HOST + URL.getOrg,
                        method: 'POST',
                        header: {
                            'Authorization': 'Basic dGVzdDpwYXNzd2Q=',
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: {mac: mac},
                        success: function (res) {
                            let code = res.data.org_code;
                            for (let index in orgList) {
                                if (orgList[index].code == code) {
                                    self.setData({
                                        libIndex: index,
                                        libIndexCode: code,
                                    })
                                }
                            }
                        }
                    })
                }
            }
        })
    },
    onShow: function () {
        let self = this;
        wx.request({
            // url: app.globalData.server + '/api/v5/mini/myInfo',
            url: HOST + URL.myInfo,
            method: 'POST',
            header: {
                'Authorization': 'Basic dGVzdDpwYXNzd2Q=',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                openid: app.globalData.openid
            },
            success: function (res) {
                if (!res.data.status) {
                    wx.navigateTo({
                        url: '../../login/idencodeLogin/idencodeLogin',
                    })
                }
            }
        })
    },
    //获取用户输入的读者卡
    cardnoInput: function (e) {
        this.setData({
            cardno: e.detail.value
        })
    },
    //获读者卡密码
    cardpwdInput: function (e) {
        this.setData({
            cardpwd: e.detail.value
        })
    },
    // 绑卡
    binding: function (e) {
        let self = this;
        let cardno = this.data.cardno;
        let cardpwd = this.data.cardpwd;
        let org_id = this.data.libArray[this.data.libIndex].id;
        if (!cardno || !cardpwd) {
            wx.showToast({title: '请将信息填写完整', icon: 'none', duration: 2000})
            return;
        }
        if (!(/[0-9]/.test(cardno))) {
            wx.showToast({title: '读者证号错误', icon: 'none', duration: 2000})
            return;
        }
        this.setData({
            hiddenLoading: false,
        });
        //立即绑定信息
        wx.request({
            url: HOST + URL.bindingCard,
            method: 'POST',
            header: {
                'Authorization': 'Basic dGVzdDpwYXNzd2Q=',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                cardno: cardno,
                cardpwd: cardpwd,
                org_id: org_id,
                openid: app.globalData.openid
            },
            success: function (res) {
                self.setData({
                    hiddenLoading: true,
                });
                if (res.data.status) {
                    wx.showModal({
                        title: '提示',
                        content: '绑定成功',
                        showCancel: false,
                        success: function (res) {
                            wx.navigateBack({
                                delta: 1
                            })
                        }
                    })
                } else {
                    wx.showToast({title: res.data.message, icon: 'none', duration: 2000})
                    return;
                }
            }
        })
    },
    //立即在线办证
    ecard: function () {
        let self = this;
        console.log(1111111111,app.globalData.openid);
        wx.request({
            url: HOST + URL.onlineCard,
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
                })
                if (res.data.errorKey == "ecardOrderPass") {
                    wx.redirectTo({
                        url: '../auditSuccess/auditSuccess',
                    })
                } else if (res.data.errorKey == "subPayNotpass" || res.data.errorKey == "subInfoNotpass") {
                    wx.redirectTo({
                        url: '../auditFailure/auditFailure',
                    })
                } else if (res.data.errorKey == "ecardOrderAudit") {
                    wx.redirectTo({
                        url: '../paySuccess/paySuccess',
                    })
                } else {
                    wx.redirectTo({

                        url: '../onlineCertificate/onlineCertificate?org_code=' + self.data.libIndexCode,
                    })
                }
            }
        })
    }
})