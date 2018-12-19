// pages/component/bookDetail/bookDetail.js
const {HOST, URL} = require('../../utils/api');
const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        book_id: '',
        hiddenLoading: true,
        title: '',
        author: '',
        price: '',
        content: '暂无内容',
        publisher: '',
        isbn: '',
        publishdate: '',
        coverimg: '../../../image/default_coverimg.png',
    },
    onLoad: function (options) {
        let self = this;
        let book_id = options.book_id;
        this.setData({
            hiddenLoading: false,
            book_id: book_id
        });
        //书籍详情
        wx.request({
            url: HOST + URL.bookDetails + book_id,
            method: 'POST',
            header: {
                'Authorization': 'Basic dGVzdDpwYXNzd2Q=',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                let book = res.data.book;
                self.setData({
                    hiddenLoading: true,
                    title: book.title,
                    author: book.author,
                    price: book.price,
                    publisher: book.publisher,
                    isbn: book.isbn,
                    publishdate: book.publishdate,
                    coverimg: book.coverimg,
                });
                if (book.bookExt.contentintro) {
                    self.setData({
                        content: book.bookExt.contentintro,
                    })
                }
            }
        })
    },
    // 图书封面显示错误时用默认封面代替
    errorCoverimg: function (e) {
        if (e.type == "error") {
            this.setData({
                coverimg: '../../../image/default_coverimg.png',
            })
        }
    },
    borrowDetail: function () {
        let self = this;
        console.log(1111,app.globalData.openid);
        wx.request({
            // url: app.globalData.server + '/api/v5/mini/myInfo',
            url: HOST + URL.myInfo,
            method: 'POST',
            header: {
                'Authorization': 'Basic dGVzdDpwYXNzd2Q=',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                openid: app.globalData.openid,
            },
            success: function (res) {


                self.setData({
                    hiddenLoading: true,
                });
                // 判断登录
                if (!res.data.status) {
                    wx.navigateTo({
                        url: '../login/idencodeLogin/idencodeLogin',
                    })
                } else {
                    // 判断绑卡
                    wx.request({
                        url: HOST + URL.bindCard,
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
                                wx.showModal({
                                    title: '提示',
                                    content: '请先绑定您的读者卡',
                                    success: function (res) {
                                        if (res.confirm) {
                                            wx.navigateTo({
                                                url: '../bindBookcard/bindBookcard',
                                            })
                                        }
                                    }
                                })
                            } else {
                                wx.redirectTo({
                                    url: '../bookOrder/bookOrder?book_id=' + self.data.book_id,
                                })
                            }
                        }
                    })
                }
            }
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '',
            path: ''
        }
    }
})