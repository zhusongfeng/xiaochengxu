//获取应用实例
const {HOST, URL} = require('../../utils/api');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchWordArray:[],
  },
  onLoad: function (options) { 
    let self = this;
    wx.getStorage({
      key: 'keyWord',
      success: function (res) {
        let historykey = res.data;
        self.setData({
          historykey: historykey,
          hiddenLoading: true,
        })   
      },
    });

    wx.request({
        url: HOST + URL.searchHotKey,
        method: 'POST',
        header: {
            'Authorization': 'Basic dGVzdDpwYXNzd2Q=',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
      success: function (res) {
        let hotkey = res.data;
        self.setData({
          hotkey: hotkey,
          hiddenLoading: true,
        })
      }
    })
  },
  searchInput:function(e){
    this.setData({
      searchWord: e.detail.value
    })
  },
  searchBook:function(){
    let searchWord = this.data.searchWord;  
    let temp = this.data.searchWordArray.push(searchWord);
    this.setData({
      searchWordArray: temp
    });
    wx.setStorage({
      key: 'keyWord',
      data: temp,
    });
    if (!searchWord) {
      wx.showToast({title: '您未输入搜索内容', icon: 'none', duration: 2000})
      return;
    }  
    wx.navigateTo({
      url: "../searchResult/searchResult?key=" + searchWord,
    })
   
  },
  clearHistory:function(){
    wx.removeStorage({
      key: 'keyWord',
    });
    self.setData({
      historykey: null,
    })
  }
});