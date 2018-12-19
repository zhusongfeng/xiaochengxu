const HOST = 'https://www.shuduier.com';
const URL = {
    phoneCode: '/api/v5/mini/phoneCode',                                                // 短信验证码
    openId: '/api/v5/mini/getOpenid',                                                   // openid
    login: '/api/v5/mini/loginByCode',                                                  // 登录
    v4: '/api/v4',                                                                      // 书籍
    ecard: '/api/v4/ecard/index',                                                      // 在线办证
    valiQrocde: '/api/v5/mini/valiQrocde',                                            // 二维码
    searchHotKey: '/api/book/searchHotKey',                                           // 热搜词
    search: '/api/book/search/',                                                     // 搜索
    bookDetails: '/api/book/',                                                         // 书籍详情
    myInfo: '/api/v5/mini/myInfo',                                                         // 获取用户信息
    bindCard: '/api/user/isBinding',                                                         // 绑定卡号
    orgList: '/api/v4/org/orgList',                                                         // 图书馆列表
    getOrg: '/api/v5/mini/getOrg',                                                         // 选中的图书馆名称
    bindingCard: '/api/v4/user/bindingCard',                                                         // 信息录入完成绑定卡号
    onlineCard: '/api/v4/ecard',                                                        // 在线办卡
    hasEcardOrgList: '/api/org/hasEcardOrgList',                                                        // 获取E卡结构列表
    rule: '/api/ecard/rule',                                                        // 网上办卡须知
    subInfo: '/api/v4/ecard/subInfo',                                                      // 设置个人信息
    ecardOrderInfo: '/api/v4/ecard/ecardOrderInfo',                                                      // 提交审核成功
    payOk: '/api/v4/ecard/payOk',                                                      // 支付成功
    miniwxpay: '/api/v5/mini/miniwxpay',                                                      // 调微信支付接口
    subjectBookList: '/api/book/subjectBookList/',                                                      // 获取更多图书列表
    borrowList: '/api/v5/mini/borrowList',                                                      // 借阅列表


};
const CODE = {
    succ: '00'
};
module.exports = {
    HOST,
    URL,
    CODE
};