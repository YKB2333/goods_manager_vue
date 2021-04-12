import axios from '@/utils/request'

export function getCategoryList(data) {
  return axios.post(`/goods/category/getCategoryPager`, data)
}

// #region 试用分类

export function getNewProductsCategoryList() { // 产品管理中心 - 获取所有试用分类信息
  return axios.get(`/goods/newProductsCategory/findAll`)
}
// /goods/newProductsCategory / findAll
// 产品管理中心 - 获取所有试用分类信息

// #endregion