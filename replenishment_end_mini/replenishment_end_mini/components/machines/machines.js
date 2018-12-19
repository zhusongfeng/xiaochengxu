// components/machines/mahines.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: String, // caution => 过期机器, replenishment => 待补货机器, all => 全部机器
    machines: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    queryValue: ''
  },
  attached(){
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
/*    goToLink: e => {
      let url = "/pages/machineDetails/machineDetails?machine=" + JSON.stringify(e.currentTarget.dataset.machine)
      wx.navigateTo({
        url
      })

    }*/
  }
})
