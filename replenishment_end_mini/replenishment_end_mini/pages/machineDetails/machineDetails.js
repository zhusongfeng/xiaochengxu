const {
  URL,
  CODE
} = require('../../utils/api.js')
const app = getApp()
const ajax = app.ajax
const errorMsg = app.errorMsg
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEditing: false,
    isMenuOpen: false,
    isOperateDialogShow: false,
    isCautionDialogShow: false,
    isGoogsDialogShow: false,
    isStatusDialogShow: false,

    cautionDialogData: {
      title: '过期提醒设置',
    },
    overdueRadioGroup: [{
        type: 'RELEASE',
        checked: true
      },
      {
        type: 'EXPIRY',
        checked: false
      }
    ],
    cautionMonth: 0,
    productionDate: [],
    targetDate: [],
    replenishBtn: true,
    productname: '',
    goodsList: [],
    statusIndex: 0, //货道状态对应下表值
    hatchStatus: [{
        val: 'WORKING',
        name: '正常'
      },
      {
        val: 'UNWORKING',
        name: '停售'
      },
      {
        val: 'BREAKDOWN',
        name: '故障'
      }
    ],
    chooseTimeType: 'RELEASE', //生产日期:RELEASE,过期时间:EXPIRY
    overdueDate: '',
    tixingDate: '',
    dialogTitle: '安全预警',
    command: '',
    message: {
      tips: '',
      operator: ''
    },
    menuItems: [{
        iconUrl: '/images/device/icon-chakan@3x.png',
        name: '查看详情',
        tapFn: 'seeDetails'
      },
      {
        iconUrl: '/images/device/icon-kaimen@3x.png',
        name: '一键开门',
        tapFn: 'showCommandDialog',
        command: 'allOpen'
      },
      {
        iconUrl: '/images/device/icon-buhuo@3x.png',
        name: '一键补满',
        tapFn: 'showCommandDialog',
        command: 'allReplenishment'
      },
      {
        iconUrl: '/images/device/icon-baoxiu@3x.png',
        name: '故障报修',
        tapFn: 'repair'
      }
    ],
    editValue: '',
    device: {
      terminalCode: '',
      merchantName: '', //商户名
      roomNum: '', //房间号
      isOnline:'',
      lastSupplyDate: '', // 上次补货时间
      status: {
        wifi: true,
        temperature: false
      },
      passages: [] // 房间信息
    },
    allDoorNum: [],
    selectDoorNum: '',
    selectHatchStatus: 'WORKING',
    selectHatchGoods: '',
    faultType: 0,
    repairDialog: false,
    merchantCode: '', //商户编号
    expType: "RELEASE", //过期类型
    isFromSelect: false, //是否通过选择商品点击日期确定
    formUrl: '', //跳转来源
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let {
      merchantCode,
      formUrl
    } = JSON.parse(options.machine);
    wx.showLoading({
      title: '数据加载中',
    })
    let device = JSON.parse(decodeURIComponent(options.machine));
    this.setData({
      device,
      merchantCode,
      formUrl
    })
    console.log(this.data.device)
    this.getAllHatchInfo()
      .then(() => {
        wx.hideLoading();
      })
  },
  refresh(){
    ajax({
      path: URL.qrMachine + this.data.device.machineQr,
      method: 'GET',
      success: ({ data }) => {
        if (data.code === CODE.succ) {
          const result = data.result;
          this.setData({
            'device.isOnline': result.terminal.isOnline
          })
          wx.showToast({
            title: '刷新成功！',
          })
        } else {
          errorMsg(data.message)
          return
        }
      }
    })
  },
  //获取所有货道信息
  getAllHatchInfo() {
    return new Promise((resolve, reject) => {
      ajax({
        path: URL.getAllHatchInfo + '/' + this.data.device.terminalCode,
        method: 'GET',
        success: ({
          data
        }) => {
          let {
            code,
            result,
            message
          } = data
          if (code === '00') {
            let allDoorNum = [];
            result.forEach((arr, index) => {
              allDoorNum[index] = arr.hatch.doorNum;
            });
            let passages = result.reduce((prev, next) => {
              let expStatus = ''; //保质类型，临保/正常/过期
              let lightBtn = false;
              let exp = next.warnDate ? next.warnDate.warnTime : null;
              exp = exp ? exp.replace(/-/g, '/') : ''; //兼容ios getTime()方法-lwq
              let time = new Date(exp).getTime();
              let currentDate = new Date().getTime(); //当前时间
              let accessDate = time - 30 * 24 * 60 * 60 * 1000; //临保时间

              if (currentDate > time) {
                expStatus = 'EXPIRED'

              } else if (accessDate < currentDate && currentDate < time) {
                expStatus = 'ACCESS_EXPIRED'

              }
              prev.push({
                doorNum: next.hatch.doorNum,
                imageUrl: next.hatch.goods.imgAddress || '/images/machine/none.png',
                productName: next.hatch.goods.goodsName || '暂无商品',
                goodsCode: next.hatch.goods.goodsCode,
                overdueTime: next.stock.lastSupplyDate,
                sufficient: next.stock.currentAvailableAccount === next.stock.capability,
                isClosed: next.hatch.isClosed,
                status: next.hatch.status,
                capability: next.stock.capability, //总库存
                currentAvailableAccount: next.stock.currentAvailableAccount, //当前库存
                expStatus: expStatus //保质类型，临保/正常/过期

              })
              return prev;
            }, []);
            console.log('passages', passages);
            let satatusLists = passages.reduce((prevs, nexts) => {
              prevs.push({
                expStatus: nexts.expStatus,
                capability: nexts.capability,
                currentAvailableAccount: nexts.currentAvailableAccount,
                status: nexts.status
              });
              return prevs;
            }, []);
            console.log('satatusLists', satatusLists); // 取出状态值放入数组
            let finishLists = satatusLists.filter(item => {
              return item.expStatus == "" && (item.capability - item.currentAvailableAccount == 0) || item.status != 'WORKING'; // 取出符合条件值
            })
            if (finishLists.length == satatusLists.length) {
              setTimeout(() => {
                let replenishmentUrl = "/pages/replenishmentInventory/replenishmentInventory"; //补货清单
                let overdueUrl = "/pages/overdueInventory/overdueInventory"; //保质期警报
                if (this.data.formUrl == 'null') {
                  wx.navigateTo({
                    url: replenishmentUrl
                  })
                } else if (this.data.formUrl == 'notNull') {
                  wx.navigateTo({
                    url: overdueUrl
                  })
                }
              }, 3000)
            }
            let lastSupplyDate = result[0].stock.lastSupplyDate;
            let merchantName = result[0].merchantName;
            let roomNum = result[0].roomNum;
            passages.sort(this.compare('doorNum'));
            this.setData({
              ['device.passages']: passages,
              ['device.lastSupplyDate']: lastSupplyDate,
              ['device.merchantName']: merchantName,
              ['device.roomNum']: roomNum,
              allDoorNum,
            })
            resolve(passages)
          } else {
            errorMsg(message)
            reject(message)
          }
        },
        error: e => {
          reject()
        }
      })
    })
  },
  compare(propertyName) {
    return function(object1, object2) {
      var value1 = object1[propertyName];
      var value2 = object2[propertyName];
      if (value2 < value1) {
        return 1;
      } else if (value2 > value1) {
        return -1;
      } else {
        return 0;
      }
    }
  },
  //显示更换商品弹窗
  showChangeGoods(e) {
    let keywords = e.detail.value || "";
    let hatchStatus = e.currentTarget.dataset.status;
    //hatchStatus = undefined的时候是因为页面有相同两个showChangeGoods方法。
    if (hatchStatus == 'WORKING' || hatchStatus == undefined) {
      this.setData({
        selectDoorNum: e.currentTarget.dataset.doornum || this.data.selectDoorNum,
        productname: e.currentTarget.dataset.productname || this.data.productname,
        isGoogsDialogShow: true,
      })
      ajax({
        path: URL.queryGoods,
        method: 'POST',
        data: {
          timestamp: (new Date()).getTime(),
          value: {
            merchantCode: this.data.merchantCode,
            keywords: [keywords]
          }
        },
        success: ({
          data
        }) => {
          if (data.code === CODE.succ) {
            this.setData({
              goodsList: data.result.list,
              selectDoorNum: this.data.selectDoorNum,
              productname: this.data.productname
            })
            if (data.result.list.length === 0) {
              errorMsg("暂无此商品")
            }
          } else {
            errorMsg(data.message)
          }
        },
        error: e => {}
      })

    } else {
      return;

    }

  },
  //选择
  saveGoods(e) {
    let {
      exptype,
      goodscode
    } = e.target.dataset;
    this.setData({
      isCautionDialogShow: true,
      expType: exptype,
      selectHatchGoods: goodscode,
      isFromSelect: true
    })
  },
  //日期点击确定
  setOverdueDate(e) {
    if (this.data.overdueDate) {
      let type = this.data.expType;
      let date = this.data.targetDate;
      let proDate = new Date(date.join('-')).getTime(); //生产日期选择日期
      let expDate = new Date(date.join('-')).getTime(); //到期日期选择日期
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      if (month < 10) {
        month = '0' + month;
      }
      let day = now.getDate();
      let nowTime = new Date(year + '-' + month + '-' + day).getTime();
      if (type == 'RELEASE') {
        if (proDate > nowTime) {
          wx.showToast({
            title: '生产日期不能大于今天',
            icon: 'none'
          });
          return;
        }
      } else if (type == 'EXPIRE') {
        if (expDate <= nowTime) {
          wx.showToast({
            title: '到期日期不能小于今天',
            icon: 'none'
          });
          return;
        }
      }
      ajax({
        path: URL.setExpiredTime,
        method: 'POST',
        data: {
          timestamp: Date.now(),
          value: {
            selectDate: {
              selectTime: date.join('-')
            },
            hatch: {
              terminalCode: this.data.device.terminalCode,
              doorNum: this.data.selectDoorNum,
              goodsCode: this.data.selectHatchGoods
            }
          }
        },
        success: ({
          data
        }) => {
          if (data.code === CODE.succ) {
            if (this.data.isFromSelect) {
              this.changeGood();
              console.log("a");
            } else {
              console.log("b");
              this.openSingleDoor();
            }
          } else {
            errorMsg(data.message)
          }
        }
      })
      this.setData({
        isCautionDialogShow: false,
        overdueDate: '',
        targetDate: [] // 截止日期清空
      })
    } else {
      errorMsg('日期不能为空！')
    }
  },
  //选择更换商品
  changeGood() {
    ajax({
      path: URL.changeGoods,
      method: 'POST',
      data: {
        timestamp: (new Date()).getTime(),
        value: [{
          goodsCode: this.data.selectHatchGoods,
          doorNum: this.data.selectDoorNum,
          terminalCode: this.data.device.terminalCode
        }]
      },
      success: ({
        data
      }) => {
        if (data.code === CODE.succ) {
          this.openSingleDoor();
        } else {
          errorMsg(data.message)
        }
      },
      error: e => {

      }
    })
  },
  //单个货道开门
  openSingleDoor() {
    ajax({
      path: URL.openSingleDoor,
      method: 'POST',
      data: {
        timestamp: (new Date()).getTime(),
        value: {
          terminalCode: this.data.device.terminalCode,
          door: this.data.selectDoorNum,
        }
      },
      success: ({
        data
      }) => {
        if (data.code === CODE.succ) {
          this.setData({
            isGoogsDialogShow: false,
            replenishBtn: false
          })
          this.singleReplenish();
        } else {
          errorMsg(data.message)
        }
      },
      error: e => {}
    })
  },
  //单个货道补货
  singleReplenish() {
    ajax({
      path: URL.singleReplenish,
      method: 'POST',
      data: {
        timestamp: (new Date()).getTime(),
        value: {
          terminalCode: this.data.device.terminalCode,
          doorNum: this.data.selectDoorNum,
        }
      },
      success: ({
        data
      }) => {
        if (data.code === CODE.succ) {
          if (this.data.isFromSelect) {
            wx.showToast({
              title: '更换商品成功',
              icon: 'none'
            });
          } else {
            wx.showToast({
              title: '补货成功',
              icon: 'none'
            });
          }

          this.setData({
            isGoogsDialogShow: false,
            replenishBtn: false,
            isFromSelect: false
          })
          this.getAllHatchInfo();
        } else {
          errorMsg(data.message)
        }
      },
      error: e => {}
    })
  },

  //显示更换货道状态弹窗
  showStatusDialog(e) {
    let hatchData = e.currentTarget.dataset,
      hatchIndex = hatchData.hatchIndex === "WORKING" ? 0 : (hatchData.hatchIndex === "UNWORKING" ? 1 : 2),
      doorNum = hatchData.doorNum;
    this.setData({
      statusIndex: hatchIndex,
      selectDoorNum: doorNum,
      isStatusDialogShow: true
    })
  },
  //改变货道状态picker
  changehatchStatus(e) {
    this.setData({
      selectHatchStatus: e.detail.value === '0' ? "WORKING" : (e.detail.value === '1' ? "UNWORKING" : "BREAKDOWN"),
      statusIndex: e.detail.value
    })
  },
  //设置货道状态
  setHatchStatus(e) {
    ajax({
      path: URL.changeHatchStatus,
      method: 'POST',
      data: {
        "timestamp": (new Date()).getTime(),
        "value": [{
          "terminalCode": this.data.device.terminalCode,
          "doorNum": this.data.selectDoorNum,
          "status": this.data.selectHatchStatus
        }]
      },
      success: ({
        data
      }) => {

        if (data.code === CODE.succ) {
          wx.showToast({
            title: '操作成功',
            icon: 'none'
          });
          this.getAllHatchInfo();

        } else {
          errorMsg(data.message)
        }
        setTimeout(() => {
          this.setData({
            isStatusDialogShow: false
          })
        }, 1000)
      },
      error: e => {}
    })

  },


  // 点界面任意地方，菜单栏收起
  getEventTarget(e) {
    if (this.data.isMenuOpen) {
      this.setData({
        isMenuOpen: false
      })
    }
  },
  faultTypeChange(e) {
    this.setData({
      faultType: e.detail.key
    })
  },
  toggleMenu() {
    this.setData({
      isMenuOpen: !this.data.isMenuOpen
    });
  },
  // menu的点击事件
  seeDetails() {},
  repair() {
    this.setData({
      repairDialog: true
    })
  },
  executeRepair() {
    let type = ''
    switch (Number(this.data.faultType)) {
      case 0:
        type = 'DOOR_LOCK_BREAKDOWN'
        break;
      case 1:
        type = 'TEMPERATURE_MODE_BREAKDOWN'
        break;
      case 2:
        type = 'WIFE_MODE_BREAKDOWN'
        break;
    }
    ajax({
      path: URL.breakdownReport,
      method: 'POST',
      data: {
        timestamp: Date.now(),
        value: {
          "terminalCode": this.data.device.terminalCode,
          type
        }
      },
      success: ({
        data
      }) => {

        if (data.code === CODE.succ) {
          wx.showToast({
            title: '报修成功',
            icon: 'none'
          })
        } else {
          errorMsg(data.message)
        }
        setTimeout(() => {
          this.setData({
            repairDialog: false
          })
        }, 1000)
      },
      error: e => {}
    })
  },
  closeRepair() {
    this.setData({
      repairDialog: false
    })
  },
  menuTap(e) {
    this[e.currentTarget.dataset.fn](e);
  },
  /**
   * 编辑设备位置信息
   */
  edit() {
    // wx.navigateTo({url:'../../pages/machineEdit/machineEdit'})
    this.setData({
      isEditing: true,
      editValue: this.data.device.roomPosition
    })
  },
  modifyPos() {
    ajax({
      path: URL.updateRoomInfo,
      method: 'POST',
      data: {
        timestamp: Date.now(),
        value: {
          "terminalCode": this.data.device.terminalCode,
          roomNum: this.data.editValue
        }
      },
      success: ({
        data
      }) => {
        if (data.code === CODE.succ) {
          wx.showToast({
            title: '修改成功',
            icon: 'none'
          })
          this.setData({
            ['device.roomPosition']: data.result.roomNum
          })
        } else {
          errorMsg(data.message)
        }
      },
      error: e => {}
    })
  },
  blurPosValue(e) {
    let value = e.detail.value;
    if (this.data.editValue !== value) {
      this.setData({
        editValue: value
      });
      this.modifyPos();
    }
    this.setData({
      isEditing: false
    });
  },
  // 命令弹窗复用
  showCommandDialog(e) {
    let data = e.currentTarget.dataset
    let command = data.command,
      type,
      message;
    switch (command) {
      case 'allOpen':
        type = command;
        message = {
          tips: '请再次确认是否',
          operator: '一键开门'
        };

        break;
      case 'allReplenishment':
        type = command;
        message = {
          tips: '请再次确认是否',
          operator: '一键补货'
        };
        break;
      case 'open':
        type = command;
        message = {
          tips: '请再次确认是否打开：',
          operator: data.doorNum + '号货道'
        };
        break;
      case 'replenishment':
        type = command;
        message = {
          tips: '请再次确认是否补货：',
          operator: data.doorNum + '号货道'
        };
        break;
      case 'update':
        type = command;
        message = {
          tips: '请再次确认更新：',
          operator: this.data.doorNum + '号货道'
        };
        break;
      case 'changeGoods':
        type = command;
        message = {
          tips: '请再次确认更换：',
          operator: this.data.selectDoorNum + '号货道货物'
        };
        break;
    }
    this.setData({
      message,
      command: type,
      selectDoorNum: data.doorNum || this.data.selectDoorNum,
      isOperateDialogShow: true
    })
  },
  // 弹窗命令统一处理 终端操作
  executeCommand() {
    let data = {},
      path = '',
      method = 'GET',
      terminalCode = this.data.device.terminalCode,
      _self = this;
    switch (this.data.command) {
      case 'allOpen':
        path = URL.openMutiplyDoor + '/' + terminalCode
        method = 'POST'
        data = {
          timestamp: Date.now(),
          value: {
            lockNums: this.data.allDoorNum,
            lampLightMode: 'LIGHT_UP',
            lightValue: 4000
          }
        }
        break;
      case 'allReplenishment':
        path = URL.allReplenish
        method = "POST"
        data = {
          timestamp: Date.now(),
          value: {
            "terminalCode": terminalCode
          }
        }
        break;
      case 'open':
        path = URL.openSingleDoor + '/' + terminalCode
        method = 'POST'
        data = {
          timestamp: Date.now(),
          value: {
            lockNums: [this.data.selectDoorNum],
            delayTime: 1000,
            lamplightMode: "GLINT",
            lightValue: 8
          }
        }
        break;
      case 'replenishment':
        path = URL.singleReplenish
        method = 'POST'
        data = {
          timestamp: Date.now(),
          value: {
            doorNum: this.data.selectDoorNum,
            terminalCode: terminalCode
          }
        }

        break;
    }
    ajax({
      path: path,
      method: 'POST',
      data,
      success: ({
        data
      }) => {
        if (data.code === CODE.succ) {
          wx.showToast({
            title: '操作成功'
          });
          this.getAllHatchInfo()
        } else {
          errorMsg(data.message)
        }
      },
      error: e => {
        errorMsg('网络或服务器故障，操作失败')
      }
    })

    this.setData({
      isOperateDialogShow: false
    });
  },

  // 弹窗关闭功能复用
  closeDialog(e) {
    this.setData({
      [e.currentTarget.dataset.name]: false
    });
  },
  closeGoogsDialog(e) {
    this.setData({
      isGoogsDialogShow: false
    });
  },
  radioChange(e) {
    this.data.overdueRadioGroup.forEach((item, index) => {
      let type = e.detail.value
      let value = item.type === type ? true : false;
      let exipredTime =
        type === 'RELEASE' ?
        this.addMonth(new Date(this.data.productionDate.join('-')), this.data.cautionMonth).toLocaleDateString().replace(/\//g, '-') :
        this.data.targetDate.join('-')

      let key = `overdueRadioGroup[${index}].checked`
      this.setData({
        [key]: value,
        chooseTimeType: type
      })
      // 根据被选中的日期设置过期时间

      value && this.setData({
        overdueDate: exipredTime,
        targetDate: exipredTime.split('-'),
        tixingDate: ''
      })
    })
  },
  changeDate(e) {
    let key = e.currentTarget.dataset.type;
    let date = e.detail.value;
    let result;
    if (key === 'productionDate') {
      // 再基础加上9*30天
      let d = new Date(date)
      d = this.addMonth(d, this.data.cautionMonth)
      result = d.toLocaleDateString().replace(/\//g, '-')
      // 直接加9个月
      // let d = new Date(date);
      // d = new Date(d.getFullYear(), d.getMonth() + +this.data.cautionMonth, d.getDate());
    } else {
      result = date;
    }

    this.setData({
      [key]: date.split('-'),
      overdueDate: result,
      targetDate: result.split('-'),
      tixingDate: ''
    })

  },
  addMonth(date, dayCount) {
    date.setTime(+date + dayCount * 24 * 3600 * 1000)
    return date
  },
  showCautionDialog(e) {
    const {
      doorNum,
      goodsCode
    } = e.currentTarget.dataset
    this.setData({
      isCautionDialogShow: true,
      productionDate: [],
      targetDate: [],
      selectDoorNum: doorNum,
      selectHatchGoods: goodsCode
    })
    this.getHatchGoodsExpiredTime(e.currentTarget.dataset)
      .then((res) => {

        this.setData({
          chooseTimeType: res.result.selectType,
          tixingDate: res.result.warnTime.trim().split(' ')[0], //提醒时间
          cautionMonth: res.result.expireDay,
        })
      })
  },
  getHatchGoodsExpiredTime(obj) {

    const {
      doorNum,
      goodsCode
    } = obj
    return new Promise((resolve, reject) => {
      ajax({
        path: URL.getExpiredTime,
        method: 'POST',
        data: {
          timestamp: Date.now(),
          value: {
            terminalCode: this.data.device.terminalCode,
            doorNum,
            goodsCode
          }
        },
        success: ({
          data
        }) => {
          let {
            code,
            result,
            message
          } = data
          if (code === '00') {
            resolve(data)
          } else {
            errorMsg(message)
            reject(message)
          }
        },
        error: e => {
          reject()
        }
      })
    })
  },
  /*
   * replenish方法补货
   */
  replenish(e) {
    const {
      doornum,
      goodscode
    } = e.currentTarget.dataset;
    this.setData({
      isCautionDialogShow: true,
      targetDate: [],
      selectDoorNum: doornum,
      selectHatchGoods: goodscode
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getAllHatchInfo()
      .then(() => {
        this.refresh();
        wx.stopPullDownRefresh()
      })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})