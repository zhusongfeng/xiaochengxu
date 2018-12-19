const {HOST, URL} = require('../../utils/api');
const app = getApp();

Page({
    data: {
        server: 'https://www.shuduier.com',
        hiddenLoading: false,
        menuImgArray: [
            {id: 0, menuName: "在线办证", imgSrc: '../../image/zaixianbanzhen.png', bindtap: "ecardorder"},
            {id: 1, menuName: "我的借阅", imgSrc: '../../image/wodejieyue.png', bindtap: "myBorrow"}
        ],
        imgUrls: [
            {id: 1, imgSrc: '../../image/swiper/7.png'},
            {id: 2, imgSrc: '../../image/swiper/2.jpg'},
            {id: 3, imgSrc: '../../image/swiper/3.jpg'},
            {id: 4, imgSrc: '../../image/swiper/4.png'},
            {id: 5, imgSrc: '../../image/swiper/5.png'},
            {id: 6, imgSrc: '../../image/swiper/6.png'},
            {id: 7, imgSrc: '../../image/swiper/1.jpg'},
        ],
        indicatorDots: false,
        autoplay: true,
        interval: 3000,
        duration: 1000,
        vertical: false,
        // 首页专题
        newbooks: '',
        quickbooks: '',
    },
    onLoad: function (options) {
        let self = this;
        // 获取openid
        if (!app.globalData.openid) {
            wx.login({
                success: function (res) {
                    console.log('000000', res);
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
                                self.wxScanLogin(options);

                            },
                            error(e) {
                                console.log('error' + e)
                            },
                        })
                    }
                }
            })
        } else {
            self.wxScanLogin(options);
        }
        wx.request({
            url: HOST + URL.v4,
            method: 'POST',
            header: {
                'Authorization': 'Basic dGVzdDpwYXNzd2Q=',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                let newbooks = res.data.newbooks;
                let quickbooks = res.data.quickbooks;
                for (let index in newbooks.bookList) {
                    let coverimg = newbooks.bookList[index].coverimg;
                    if (coverimg.indexOf("//img") == -1 && coverimg.indexOf("http") == -1) {
                        newbooks.bookList[index].coverimg = 'https://www.shuduier.com' + coverimg;
                    }
                }
                for (let index in quickbooks.bookList) {
                    let coverimg = quickbooks.bookList[index].coverimg;
                    if (coverimg.indexOf("//img") == -1 && coverimg.indexOf("http") == -1) {
                        quickbooks.bookList[index].coverimg = 'https://www.shuduier.com' + coverimg;
                    }
                }
                self.setData({
                    newbooks: newbooks,
                    quickbooks: quickbooks,
                    hiddenLoading: true,
                });

            }
        })
    },
    scanner: function (e) {
        wx.scanCode({
            success: (res) => {
                this.setData({
                    img: res.result
                })
            },
        })
    },

    // 图书封面显示错误时用默认封面代替
    errorCoverimg: function (e) {
        let self = this;
        if (e.type == "error") {
            let errorImgIndex = e.target.dataset.errorimg;//获取错误图片循环的下标
            let newbooks = this.data.newbooks;
            let quickbooks = this.data.quickbooks;
            let imgList = this.data.newbooks.bookList; 　  //将图片列表数据绑定到变量
            let imgList2 = this.data.quickbooks.bookList;
            imgList[errorImgIndex].coverimg = "../../image/default_coverimg.png"; //错误图片替换为默认图片
            imgList2[errorImgIndex].coverimg = "../../image/default_coverimg.png";
            self.setData({
                newbooks: newbooks,
                quickbooks: quickbooks,
            })
        }
    },
    // 在线办证
    ecardorder: function (e) {
        console.log(1111111111)
        let self = this;
        self.setData({
            hiddenLoading: false,
        });

        wx.request({

            url: HOST + URL.ecard,
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
                let errorKey = res.data.errorKey;
                if (errorKey) {
                    if (errorKey == "ecardOrderAudit") { //正在审核
                        wx.navigateTo({
                            url: "../paySuccess/paySuccess"
                        })
                    } else if (errorKey == "subPayNotpass" || errorKey == "subInfoNotpass") { //审核拒绝
                        wx.navigateTo({
                            url: "../auditFailure/auditFailure?reasonList=" + res.data.reasonList
                            + "&errorKey=" + errorKey
                        })
                    } else if (errorKey == "ecardOrderPass") { //在线办证订单审核成功
                        wx.navigateTo({
                            url: "../auditSuccess/auditSuccess"
                        })
                    } else if (errorKey == "notFindUser") { //未登陆
                        wx.navigateTo({
                            url: "../component/login/idencodeLogin/idencodeLogin"
                        })
                    }
                } else {
                    wx.navigateTo({
                        url: "../component/onlineCertificate/onlineCertificate"
                    })
                }
            }
        })
    },
    // 我的借阅
    myBorrow: function () {
        wx.navigateTo({
            url: '../myBorrow/myBorrow'
        })
    },
    // 扫码登录
    scanLogin: function (e) {
        let self = this;
        if (app.globalData.scan_tip) {
            wx.showModal({
                title: '提示',
                content: '扫码登录目前只用于智能微图设备，其他二维码均无效',
                showCancel: false,
                success: function (res) {
                    self.scan();
                }
            });
            app.globalData.scan_tip = false;
        } else {
            this.scan();
        }
    },
    scan: function () {
        let self = this;
        wx.scanCode({
            onlyFromCamera: true,
            success: (res) => {
                let result;
                try {
                    result = JSON.parse(res.result);
                } catch (e) {
                    wx.showModal({
                        title: '提示',
                        content: '无效的二维码',
                        showCancel: false
                    });
                    return;
                }
                if (!result.mac || !result.token) {
                    wx.showModal({
                        title: '提示',
                        content: '无效的二维码',
                        showCancel: false
                    });
                    return;
                }
                self.setData({
                    hiddenLoading: false,
                });
                app.globalData.sgr_mac = result.mac;
                // 判二维码是否有效
                let qrcode_token = result.token;
                wx.request({
                    url: HOST + URL.valiQrocde,
                    method: 'POST',
                    header: {
                        'Authorization': 'Basic dGVzdDpwYXNzd2Q=',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                        mac: result.mac,
                        token: qrcode_token
                    },
                    success: function (res) {
                        self.setData({
                            hiddenLoading: true,
                        });
                        if (res.data.errcode == 0) {
                            // 二维码正确
                            wx.navigateTo({
                                url: "../component/shuguiLogin/bookcardLogin/bookcardLogin?qrcode_token=" + qrcode_token
                            })
                        } else {
                            wx.showModal({
                                title: '提示',
                                content: '二维码无效或已过期',
                                showCancel: false
                            });
                            return;
                        }
                    }
                })
            }
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    // 扫描普通二维码链接处理登录
    wxScanLogin(options) {
        let self = this;
        let url = decodeURIComponent(options.q);
        if (url != null && url != '' && url != 'undefined') {
            try {
                let paras = url.split("?")[1].split("&");
                let mac = paras[0].split('=')[1];
                // 下面获取的token分为两种，一种参数为 token, 用户二维码登录，两一种为 doorno， 用户打开柜门
                let token = paras[1].split('=')[1];
                app.globalData.sgr_mac = mac;
            } catch (e) {
                wx.showModal({
                    title: '提示',
                    content: '无效的二维码',
                    showCancel: false
                });
                return;
            }
            if (!mac || !token) {
                wx.showModal({
                    title: '提示',
                    content: '无效的二维码',
                    showCancel: false
                });
                return;
            }
            this.setData({
                hiddenLoading: false,
            });
            // 判二维码是否有效

            wx.request({
                url: HOST + URL.valiQrocde,
                method: 'POST',
                header: {
                    'Authorization': 'Basic dGVzdDpwYXNzd2Q=',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: {
                    mac: mac,
                    token: token
                },
                success: function (res) {
                    self.setData({
                        hiddenLoading: true,
                    });
                    if (res.data.errcode == 0) {
                        let doorno = res.data.doorno;
                        // 二维码正确
                        wx.navigateTo({
                            url: "../component/shuguiLogin/bookcardLogin/bookcardLogin?doorno=" + doorno + "&qrcode_token=" + token,
                        })
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: '二维码无效或已过期',
                            showCancel: false
                        });
                        return;
                    }
                }
            })
        }
    }
});
