const formatTime = require('../../utils/util.js').formatTime
Component({
  properties: {
    array:{//如果是selector的话，传入的数据
      type:Array,
      value:[]
    },
    pickermode:{//picker 类型
      type:String,
      value:'selector'
    },
    pickerfields: {//时间粒度
      type: String,
      value: 'day'
    },
    date:{//如果是mode==date
      type:String,
      value:''
    },
    selectData:{
      type:Number,
      value:0
    },
  },
  data: {
    // 这里是一些组件内部数据
    
    index:0
  },
  attached: function(){
    var fields = this.data.pickerfields;
 
   },
  methods: {
    // 这里是一个自定义方法
    customMethod: function () { },
    bindPickerChange: function (e) {
      var myEventDetail = { key: e.detail.value,value:this.data.array[e.detail.value]} 
      this.triggerEvent('myevent', myEventDetail)
    }, datePickerChange: function (e) {
      var myEventDetail = e.detail.value// detail对象，提供给事件监听函数
      this.triggerEvent('myevent', myEventDetail)
    }
  }
})