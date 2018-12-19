// components/e-input/e-input.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    className: String,
    customStyle: String,
    value: String,
    close: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false
  },
  created() {
   
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleInput(e) {
      let value = e.detail.value;
      this.triggerEvent('input', {
        value
      }, {}) 
      this.setData({
        isShow: !!value,
        value
      });
    },
    handleConfirm(e){
      let value = e.detail.value;
      this.triggerEvent('complete', {
        value
      }, {})
    },
    handleBlur(e){
      let value = e.detail.value;
      this.triggerEvent('blur', {
        value
      }, {})
    },
    handleClearInput(){
      this.setData({
        value: '',
        isShow: false
      })
    }
  }
})
