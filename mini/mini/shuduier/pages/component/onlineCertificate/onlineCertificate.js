// pages/component/onlineCertificate/onlineCertificate.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    libArray: [],
    libIndex: 0,
    realName: '',
    cardno: '',
    phone: '',
    address: '',
    jobArray: ['国家公务员', '文教卫体公务员', '工程技术人员', '商业服务人员', '军人', '工人', '学生', '少儿', '外籍人员', '其它'],
    jobIndex: 0,
    eduArray: ['学龄前', '小学', '初中', '高中', '中专', '大专', '本科', '研究生', '硕士', '博士及博士后'],
    eduIndex: 0,
    hiddenLoading: true,
  },
  onLoad: function (e) {
    var _this = this;
    var org_code = e.org_code;
    wx.request({
      url: app.globalData.server + '/api/org/hasEcardOrgList',
      success: function (res) {
        var orgList = res.data.orgList;
        _this.setData({
          libArray: orgList,
        })
        var _this2 = _this;
        for (var index in orgList) {
          if (orgList[index].code == org_code) {
            _this2.setData({
              libIndex: index,
            })
          }
        }
      }
    })
  },
  bindChangeLib: function (e) {
    this.setData({
      libIndex: e.detail.value
    })
  },
  bindChangeJob: function (e) {
    this.setData({
      jobIndex: e.detail.value
    })
  },
  bindChangeEdu: function(e) {
    this.setData({
      eduIndex: e.detail.value
    })
  },
  //获取用户输入的用户名
  realNameInput: function (e) {
    this.setData({
      realName: e.detail.value
    })
  },
  //获取身份证号码
  cardnoInput: function (e) {
    this.setData({
      cardno: e.detail.value
    })
  }, 
  //获取手机号
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //获取联系地址
  addressInput: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  subInfo: function(e) {
    var realName = this.data.realName;
    var cardNo = this.data.cardno;
    var mobile = this.data.phone;
    var address = this.data.address;
    var org_id = this.data.libArray[this.data.libIndex].org_id;
    var job = this.data.jobArray[this.data.jobIndex];
    var education = this.data.eduArray[this.data.eduIndex];
    if (!org_id) {
      wx.showToast({ title: '请选择机构', icon: 'none', duration: 2000 })
      return;
    }
    if(!realName){
      wx.showToast({ title: '请输入真实姓名', icon: 'none', duration: 2000 })
      return;
    }
    if (!cardNo) {
      wx.showToast({ title: '请输入身份证号', icon: 'none', duration: 2000 })
      return;
    }
    if (!mobile) {
      wx.showToast({ title: '请输入手机号', icon: 'none', duration: 2000 })
      return;
    }
    if (!address) {
      wx.showToast({ title: '请输入地址', icon: 'none', duration: 2000 })
      return;
    }
    if (!job) {
      wx.showToast({ title: '请选择职业', icon: 'none', duration: 2000 })
      return;
    }
    if (!education) {
      wx.showToast({ title: '请选择文化', icon: 'none', duration: 2000 })
      return;
    }
    this.setData({
      hiddenLoading: false,
    })
    var _this = this;
    wx.request({
      url: app.globalData.server + '/api/v4/ecard/subInfo',
      data: {
        openid: app.globalData.openid,
        org_id: org_id, realName: realName, cardNo: cardNo, mobile: mobile,
        address: address, job: job, education: education
      },
      success: function (res) {
        _this.setData({
          hiddenLoading: true,
        })
        var errorKey = res.data.errorKey;
        if (res.data.status){
          if (errorKey == "nextToAudit"){
            wx.redirectTo({
              url: "../paySuccess/paySuccess"
            })
          } else {
            wx.redirectTo({
              url: "../payDeposit/payDeposit"
            })
          }
        }else{
          wx.showToast({ title: res.data.message, icon: 'none', duration: 2000 })
          return;
        }
      }
    })
  }
})