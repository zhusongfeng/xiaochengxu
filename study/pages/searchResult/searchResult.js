//获取应用实例
const {HOST, URL} = require('../../utils/api');
const app = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        searchValue: '',//查询的关键词
        faultMachine: [],
        currentPage: 1, //当前页
        pageSize: 10,
        totalPage:0,    //总页数
        loadMode: true,   // 上拉加载更多
        bookList:[],
    },
    onLoad: function (options) {
        let self = this;
        let searchWord = options.key;
        console.log(options.key);
        self.searchValue = searchWord;

        wx.request({
            url: HOST + URL.search,
            method: 'POST',
            header: {
                'Authorization': 'Basic dGVzdDpwYXNzd2Q=',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                key: options.key
            },
            success: function (res) {
                let newbooks = res.data;
                let bookList = res.data.bookList;

                if (bookList == null || bookList == '') {
                    wx.showModal({
                        title: '温馨提示',
                        content: '暂无图书数据',
                        success: function (res) {
                            if (res.confirm) {
                                wx.navigateBack({});
                            } else {
                                wx.navigateBack({});
                            }
                        }
                    })
                }
                for (let index in bookList) {
                    let coverimg = bookList[index].coverimg;//图书的图片
                    if (coverimg != null) {
                        if (coverimg.indexOf("//img") == -1 && coverimg.indexOf("http") == -1) {
                            bookList[index].coverimg = 'https://www.shuduier.com' + coverimg;
                        }
                    } else {
                        bookList[index].coverimg = "../../../image/default_coverimg.png";
                    }
                }
                self.currentPage = newbooks.page;
                self.totalPage = newbooks.totalPage;

                self.setData({
                    bookList: bookList,
                    hiddenLoading: true,
                })
            }
        })
    },
    //加载更多
    getMoreBooks:function(e){
        let self = this;
        if(self.currentPage >= self.totalPage){
            wx.showToast({
                title: '没有更多数据啦',
                icon:'none'
            })
            return
        }
        wx.showLoading({
            title: '加载中',
        });

        return new Promise((resolve,reject)=>{

            ++self.currentPage;
            wx.request({
                // url: app.globalData.server + '/api/book/search/',
                url: HOST + URL.search,
                method: 'POST',
                header: {
                    'Authorization': 'Basic dGVzdDpwYXNzd2Q=',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: {
                    key: self.searchValue,
                    page:self.currentPage,

                },
                success: function (res) {
                    wx.hideLoading();
                    let newbooks = res.data;
                    let newBookList = res.data.bookList;
                    if (newBookList == null || newBookList == '') {
                        wx.showToast({
                            title: '没有更多数据了！',
                            icon: 'success',
                            duration: 2000
                        })
                    }
                    for (let index in newBookList) {
                        let coverimg = newBookList[index].coverimg;//图书的图片
                        if (coverimg != null) {
                            if (coverimg.indexOf("//img") == -1 && coverimg.indexOf("http") == -1) {
                                newBookList[index].coverimg = 'https://www.shuduier.com' + coverimg;
                            }
                        } else {
                            newBookList[index].coverimg = "../../../image/default_coverimg.png";
                        }
                    }
                    self.currentPage = newbooks.page;
                    self.totalPage = newbooks.totalPage;

                    self.setData({
                        bookList: self.data.bookList.concat(newBookList),
                        hiddenLoading: true,
                    })
                }
            })

        })
    },
    // 图书封面显示错误时用默认封面代替
    errorCoverimg: function (e) {
        if (e.type == "error") {
            let errorImgIndex = e.target.dataset.errorimg; //获取错误图片循环的下标
            let bookList = this.data.newbooks.bookList;
            let imgList = this.data.newbooks.bookList; 　  //将图片列表数据绑定到变量
            imgList[errorImgIndex].coverimg = "../../image/default_coverimg.png"; //错误图片替换为默认图片
            this.setData({
                bookList: bookList,
            })
        }
    },
});