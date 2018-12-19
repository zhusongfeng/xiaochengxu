const {HOST, URL} = require('../../utils/api');
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
        let self = this;
        let org_code = e.org_code;
        //获取E卡结构列表
        wx.request({
            url: HOST + URL.hasEcardOrgList,
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
                for (let index in orgList) {
                    if (orgList[index].code == org_code) {
                        self.setData({
                            libIndex: index
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
    bindChangeEdu: function (e) {
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
    subInfo: function (e) {
        let self = this;
        let realName = self.data.realName;
        let cardNo = self.data.cardno;
        let mobile = self.data.phone;
        let address = self.data.address;
        let org_id = self.data.libArray[this.data.libIndex].org_id;
        let job = self.data.jobArray[this.data.jobIndex];
        let education = self.data.eduArray[this.data.eduIndex];
        if (!org_id) {
            wx.showToast({title: '请选择机构', icon: 'none', duration: 2000});
            return;
        }
        if (!realName) {
            wx.showToast({title: '请输入真实姓名', icon: 'none', duration: 2000});
            return;
        }
        if (!cardNo) {
            wx.showToast({title: '请输入身份证号', icon: 'none', duration: 2000});
            return;
        }
        if (!mobile) {
            wx.showToast({title: '请输入手机号', icon: 'none', duration: 2000});
            return;
        }
        if (!address) {
            wx.showToast({title: '请输入地址', icon: 'none', duration: 2000});
            return;
        }
        if (!job) {
            wx.showToast({title: '请选择职业', icon: 'none', duration: 2000});
            return;
        }
        if (!education) {
            wx.showToast({title: '请选择文化', icon: 'none', duration: 2000});
            return;
        }
        self.setData({
            hiddenLoading: false,
        });

        wx.request({
            url: HOST + URL.subInfo,
            method: 'POST',
            header: {
                'Authorization': 'Basic dGVzdDpwYXNzd2Q=',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                openid: app.globalData.openid,
                org_id: org_id,
                realName: realName,
                cardNo: cardNo,
                mobile: mobile,
                address: address,
                job: job,
                education: education
            },
            success: function (res) {
                console.log(11111111111,res)
                self.setData({
                    hiddenLoading: true,
                });
                let errorKey = res.data.errorKey;
                if (res.data.status) {
                    if (errorKey == "nextToAudit") {
                        wx.redirectTo({
                            url: "../paySuccess/paySuccess"
                        })
                    } else {
                        wx.redirectTo({
                            url: "../payDeposit/payDeposit"
                        })
                    }
                } else {
                    wx.showToast({title: res.data.message, icon: 'none', duration: 2000});
                    return;
                }
            }
        })
    }
});