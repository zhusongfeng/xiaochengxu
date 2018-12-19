const {HOST, URL} = require('../../utils/api');
let app = getApp();
Page({
    data: {
        List: '',
        historyList: '',
        hiddenLoading: false,
        /**
         * 页面配置
         */
        winWidth: 0,
        winHeight: 0,
        // tab切换
        currentTab: 0,
        loading: true,
        hasMore: false,
        historylist: '',
        page: 1
    },
    onLoad: function () {
        let self = this;
        /**
         * 获取系统信息
         */
        wx.getSystemInfo({
            success: function (res) {
                self.setData({
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight + 1000,
                });
            }
        });

        wx.request({
            url: HOST + URL.borrowList,
            method: 'POST',
            header: {
                'Authorization': 'Basic dGVzdDpwYXNzd2Q=',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                openid: app.globalData.openid,
                type: 2
            },
            success: function (res) {
                let allList = res.data.list;

                self.setData({
                    hiddenLoading: true,
                    List: allList
                });
            }
        });

        self.setData({
            page: 1,
            historylist: ''
        });
        self.getDataFromServer(self.data.page, self.data.historylist);
    },
    onShow: function () {

    },
    //获取网络数据的方法
    getDataFromServer: function (page, historylist) {
        let self = this;

        self.setData({
            loading: false,
            hasMore: true
        });
        //调用网络请求
        wx.request({
            url: HOST + URL.borrowList,
            method: 'POST',
            header: {
                'Authorization': 'Basic dGVzdDpwYXNzd2Q=',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                openid: app.globalData.openid,
                type: 1,
                page: page
            },
            success: function (res) {
                if (historylist == "" || historylist == undefined) {
                    let historylist = res.data.list;
                } else {
                    historylist.data.list.push(res.data.list);
                }

                self.setData({
                    historylist: historylist,
                    loading: true,
                    hasMore: false
                });
            }
        })
    },
    /**
     * 滑动切换tab
     */
    bindChange: function (e) {
        let that = this;
        that.setData({currentTab: e.detail.current});
    },
    /**
     * 点击tab切换
     */
    swichNav: function (e) {
        let that = this;

        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
        }
    },
    //打开订单详情
    orderDetails: function () {
        wx.navigateTo({
            url: '../orderDetails/orderDetails',
        })
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
        let self = this;

        self.setData({
            page: self.data.page + 1,
            historylist: self.data.historylist
        });

        self.getDataFromServer(self.data.page, self.data.historylist);
    }
});