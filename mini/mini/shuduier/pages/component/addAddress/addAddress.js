// pages/component/addAddress/addAddress.js
const app =getApp();
Page({
  data: {
    address: '',
    name: '',
    mobile: '',
    addressStr: '',
    proArray: '',
    proIndex: 26,
    cityArray: '',
    cityIndex: 0,
    areaArray: '',
    areaIndex: 0,
    address_id: '',
  },
  onLoad: function (options) {
    this.setData({
      address_id: options.address_id,
    })
    var _this = this;
    wx.request({
      url: app.globalData.server + '/api/provinceList',
      success: function (res) {
        _this.setData({
          proArray: res.data,
        })
        var _this2 = _this;
        var proCode = _this2.data.proArray[_this2.data.proIndex].code
        wx.request({
          url: app.globalData.server + '/api/cityList/' + proCode,
          success: function (res) {
            _this2.setData({
              cityArray: res.data,
            })
            var _this3 = _this2;
            var cityCode = _this3.data.cityArray[_this2.data.cityIndex].code
            wx.request({
              url: app.globalData.server + '/api/areaList/' + cityCode,
              success: function (res) {
                _this3.setData({
                  areaArray: res.data,
                })
              }
            })
          }
        })
      }
    })
  },
  onShow: function(){
    var address_id = this.data.address_id;
    var _this = this;
    if (address_id){
      wx.request({
        url: app.globalData.server + '/api/user/addressInfo/' + address_id,
        success: function(res) {
          _this.setData({
            address: res.data.address,
            name: res.data.address.name,
            mobile: res.data.address.mobile,
            addressStr: res.data.address.addressStr,
          })
        }
      })
    }
  },
  bindChoosePro:function(e){
    this.setData({
      proIndex: e.detail.value,
    })
    var _this = this;
    var proCode = _this.data.proArray[_this.data.proIndex].code
    wx.request({
      url: app.globalData.server + '/api/cityList/' + proCode,
      success: function (res) {
        _this.setData({
          cityArray: res.data,
          cityIndex: 0,
        })
        var _this2 = _this;
        var cityCode = _this2.data.cityArray[_this2.data.cityIndex].code
        wx.request({
          url: app.globalData.server + '/api/areaList/' + cityCode,
          success: function (res) {
            _this2.setData({
              areaArray: res.data,
              areaIndex: 0,
            })
          }
        })
      }
    })
  },
  bindChooseCity: function(e){
    this.setData({
      cityIndex: e.detail.value
    })
    var _this = this;
    var cityCode = _this.data.cityArray[_this.data.cityIndex].code
    wx.request({
      url: app.globalData.server + '/api/areaList/' + cityCode,
      success: function (res) {
        _this.setData({
          areaArray: res.data,
          areaIndex: 0,
        })
      }
    })
  },
  bindChooseCounty: function(e){
    this.setData({
      areaIndex: e.detail.value
    })
  },
  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  mobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  addressStrInput: function (e) {
    this.setData({
      addressStr: e.detail.value
    })
  }, 
  cancel:function(){
    var address_id = this.data.address_id;
    var _this = this;
    _this.setData({
      hiddenLoading: true,
    })
    wx.showModal({
      title: '提示',
      content: '您确定删除该地址吗?',
      confirmText: "确定删除",
      cancelText: "再想想",
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.server + '/api/user/deleteAddress/' + address_id,
            data: {
              openid: app.globalData.openid,
              // user_id: app.globalData.address_id
            },
            success: function (res) {
              if(res.status){
                wx.redirectTo({
                  url: '../myAddress/myAddress',
                })
                // _this.setData({
                //   addressList: res.data.addressList,
                // })
              }
            }
          })
        }
      }
    })
  },
  submit: function(){
    var name = this.data.name;
    var mobile = this.data.mobile;
    var addressStr = this.data.addressStr;
    if (!name) {
      wx.showToast({ title: '请输入姓名', icon: 'none', duration: 2000 })
      return;
    }
    if (!addressStr) {
      wx.showToast({ title: '请输入详细地址', icon: 'none', duration: 2000 })
      return;
    }
    if (!(/^1[3456789]\d{9}$/.test(mobile))) {
      wx.showToast({ title: '请输入正确的手机号码', icon: 'none', duration: 2000 })
      return;
    }
    var _this = this;
    this.setData({
      disabled:true
    })
    wx.request({
      url: app.globalData.server + '/api/user/editAddress/' + this.data.address.id,
      data: {
        openid: app.globalData.openid,
        name: name, phone: mobile, address: addressStr, 
        province_code: _this.data.proArray[_this.data.proIndex].code,
        city_code: _this.data.cityArray[_this.data.cityIndex].code,
        area_code: _this.data.areaArray[_this.data.areaIndex].code,
        is_default: 1,
      },
      success: function (res) {
        if(res.data.status){
          wx.navigateBack({
            delta: 1
          })
        }else{
          wx.showToast({ title: res.data.message, icon: 'none', duration: 2000 })
          return;
        }
      }
    })
  }
})