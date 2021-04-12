
module.exports = {
  ...require(`./${process.env.VUE_APP_MODE}`),
  projectName: '商品中心管理系统',
  // 超时时间
  timeout: 60 * 1000,
  // 自定义请求携带token的字段名
  headersTokenKey: 'GoodsAdminAuth',
  // cookie过期时间
  cookieExpires: 1,
}