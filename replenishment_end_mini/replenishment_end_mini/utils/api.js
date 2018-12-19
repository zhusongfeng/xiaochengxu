const HOST = 'http://testvmims.eguagua.cn'
const producthost ="https://oa1.eguagua.cn"
const dev ='http://tmp-vmims.eguagua.cn'
const URL = {
  login: '/login',                                                // 登录
  logout: '/logout',                                              // 登出
  userInfo: '/system/current/user',                               // 用户信息查询
  userMerchants: '/system/current/user/merchants',                // 用户商户查询
  allMerchants: '/merchant/query',                // 所有的商户查询  
  allMachinesStatistics: '/terminal/statistics/count',           // 商户所有机器统计
  replenishStatistics: '/terminal/statistics/replenish/count',    // 补货机器统计
  breakdownStatistics: '/terminal/statistics/breakdown/count',    // 故障机器统计
  expTimeStatistics:'/terminal/statistics/expire/terminal/count',
  userAllMachine:'/terminal/search',//获取用户的所有机器信息
  breakdownList:'/terminal/statistics/breakdown/terminals/details',
  replenishmentMachines: '/terminal/statistics/replenish/terminals/merchants', // 补货机器查询
  breakdownMachines: '/terminal/statistics/breakdown/terminals/merchants',     // 故障机器查询
  expiredMachines: '/terminal/statistics/expired/terminals/merchants',         // 含有过期商品机器查询
  queryGoods:'/merchant/goods/query',//商品信息查询
  changeGoods:'/hatch/goods/change',//更換商品
  replenishmentInventory: '/replenishment/replenishmentList', // 补货清单查询
  orderUserMerchant: "/order/user/merchant/query",       // 查询当前用户或商户订单
  orderGoods: "/order/goods",                            // 订单商品查询
  openSingleDoor: "/terminal/open/door/terminalCode", // 单个货道开们             
  openMutiplyDoor: "/communication/doorLock/open/partly",    // 该机器多个货道开门
  allReplenish: "/replenishment/terminal/goods/fill",         // 一键补货
  singleReplenish: "/replenishment/hatch/goods/fill",         //单个或道补货
  getAllHatchInfo: "/terminal/statistics/hatch/full",               // 获取某个终端所有货道信息
  changeHatchStatus:'/terminal/hatch/update/status',//更改货道状态
  getExpiredTime: '/replenishment/hatch/goods/query/warnDate', // 获取商品过期时间
  setExpiredTime: '/replenishment/hatch/goods/updateWarnDate', // 设置商品过期时间
  expiredDetail: '/business/goods/warnDateGoodsList', //获取过期清单里面的过期详情
  expiredCount:'/business/goods/statistics/warnDateGoodsRecord',  //警报总计
  replenishmentCount:'/business/goods/replenishment',//补货商品总计
  replenishmentDetail:'/terminal/statistics/replenish/terminals/merchants',//补货详情
  breakdownReport:'/terminal/breakdown/report',//机器报修
  qrMachine:'/terminal/query/basicInfo/',//通过二维码查询机器信息
  updateRoomInfo:'/terminal/update',//编辑机器房间信息
  resetPassword: "/system/manager/user/password/reset",  //修改当前用户密码
  machineDetail:"/terminal/search/merchant", //查询机器详情
  machineBind:"/terminal/bind",//机器绑定
  machineCancel:"/terminal/unbind",//机器解绑

}
const CODE = {
  succ: '00'
}
module.exports = {
  HOST: HOST,
  URL,
  CODE
}