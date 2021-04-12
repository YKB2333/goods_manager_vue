import axios from '@/utils/request'

export function getBrandList(data) { // 分页获取品牌列表
  return axios.post(`/goods/brand/getBrandPager`, data)
}

export function getBrandAttaCount(brandIds) { // 获取品牌数量
  return axios.post(`/attachment/getCountByBrandId`, brandIds)
}

export function disabledBrand(data) { // 禁用品牌
  return axios.put(`/goods/brand/disEnable`, data)
}

export function enableBrand(data) { // 启用品牌
  return axios.put(`/goods/brand/enable`, data)
}

export function updateBrand(data) { // 修改品牌
  return axios.post(`/goods/brand/updateBrand`, data)
}

export function addBrand(data) { // 添加品牌
  return axios.post(`/goods/brand/addBrand`, data)
}

export function getAllBrandList() { // 获取全部品牌
  return axios.get(`/goods/brand/findAll`)
}

export function getBrandById(id) { // 根据Id获取品牌信息
  return axios.get(`/goods/brand/getOne/${id}`)
}

// 品牌导出
export const exportBrandList = (data) => axios.post(`/goods/brand/download`, data, { responseType: 'blob' })