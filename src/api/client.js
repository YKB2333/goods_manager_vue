import axios from '@/utils/request'

export function getAllCompanyInfo(data) { // 获取所有公司
  return axios.get('/ecology-user/getAllCompanyInfo', data)
}
export function getOAThreeSub(data) { // 获取所有公司/新！添加三级
  return axios.get('/ecology-user/getOAThreeSub', data)
}

export function getDistrictList(data) { // 获取地区数据
  return axios.post('/customer/amap-district/getDistrictList', data)
}

export function getAllEcologyUsers() { // 获取所有泛微用户
  return axios.get('/ecology-user/getAllEcologyUsers')
}

// /goods/wxuser / departments
// 三大中心 - 获取企业微信组织架构
export function getDepartments() {
  return axios.get('/goods/wxuser/departments')
}