import axios from '@/utils/request'

export function getWorkflow(spuId) {  // 根据spuID获取最近一条审批流程
  return axios.get(`/goods/spu/getWorkflow/${spuId}`)
}

export function getSpuCheckedCountList(params) {  // 商品审核统计列表
  return axios.post(`/goods/spu/spuCheckedCountList`, params)
}
export function getNewOnSaleCountList(params) {  // 商品审核统计列表-新品上架-商品清单数据
  return axios.post(`/goods/spu/getNewOnSaleCountList`, params)
}
export function getAddCountList(params) {  // 商品审核统计列表-新增商品-商品清单数据
  return axios.post(`/goods/spu/getAddCountList`, params)
}

export function getSpuTagPager(params) {  // 分页查询商品标签列表
  return axios.post(`/goods/spuTag/getSpuTagPager`, params)
}

export function getSpuTagList(params) {  // 查询商品标签列表
  return axios.post(`/goods/spuTag/getSpuTagList`, params)
}

export function batchUpdateField(params) { // 批量更新spu字段
  return axios.put(`/goods/spu/batchUpdateField`, params)
}

export function addSpuTag(params) {  // 新增商品标签
  return axios.post(`/goods/spuTag/save`, params)
}

export function updateSpuTag(params) {  // 修改商品标签
  return axios.post(`/goods/spuTag/update`, params)
}

export function deleteSpuTag(id) {  // 查询商品标签列表
  return axios.delete(`/goods/spuTag/delete/${id}`)
}

export function enableSpuTag(id) {  //启用标签
  return axios.put(`/goods/spuTag/enable/${id}`)
}

export function disableSpuTag(id) {  //禁用标签
  return axios.put(`/goods/spuTag/disable/${id}`)
}

export function relationSpuTag(params) {  // spu标签关联商品
  return axios.post(`/goods/spuTag/relation`, params)
}

export function disassociationSpuTag(params) {  // spu标签取消关联商品
  return axios.post(`/goods/spuTag/disassociation`, params)
}

export function getRelationSpuPager(params) {  // 标签关联spu商品
  return axios.post(`/goods/spuTag/getRelationSpuPager`, params)
}

export function addOrderLevel(params) {  // 批量设置标签关联商品排序
  return axios.post(`/goods/spuTag/addOrderLevel`, params)
}

export function getSpuPager(params) {  // 标签关联spu商品
  return axios.post(`/goods/spuTag/getSpuPager`, params)
}
export function exportTagSpu(params) {  // 批量导出标签关联spu商品
  return axios.post(`/goods/spuTag/exportSpu`, params, { responseType: 'blob' })
}

export function addRemark(params) {// 批量设置标签关联商品备注
  return axios.post(`/goods/spuTag/addRemark`, params)
}

export function getSkuCostPricePager(params) {  // 查询sku成本价列表
  return axios.post(`/goods/costPrice/getSkuPager`, params)
}

export function bachUpdateSkuCostPrice(params) {  // 批量修改Sku成本价 params { costPrice: number, id: number }[]
  return axios.post(`/goods/costPrice/update`, params)
}

export function importSkuCostPriceValidate(params) {  // Sku成本价导入数据校验
  return axios.post(`/goods/costPrice/importValidate`, params)
}

export function importUpdateSkuCostPrice(params) {  // 导入批量修改Sku成本价 params { costPrice: number, id: number }[]
  return axios.post(`/goods/costPrice/importUpdate`, params)
}

export function getCategoryPager(params) {  // 获取分类列表
  return axios.post(`/goods/category/getCategoryPager`, params)
}

export function findMainCategory() {  // 获取所属大类信息
  return axios.get(`/goods/category/findMainCategory`)
}

export function batchSetMainCategory(params) {  // 批量设置所属大类
  return axios.post(`/goods/category/batchSetMainCategory`, params)
}


export function getModifyLogPages(params) {  // 成本价操作日志 
  return axios.post(`/common/operationLog/getModifyLogPages`, params)
}

// #region 研发新品
export function getNewProductPager(params) {  // 研发新品列表
  return axios.post(`/goods/newProducts/getPager`, params)
}

export function addNewProduct(params) {  // 研发新品新增
  return axios.post(`/goods/newProducts/add`, params)
}

export function updateNewProduct(params) {  // 研发新品修改
  return axios.post(`/goods/newProducts/update`, params)
}

export function getNewProductById(id) {  // 研发新品修改详情
  return axios.get(`/goods/newProducts/getOne/${id}`)
}

export function batchDeleteNewProduct(ids) {  // ids 删除研发新品
  return axios.post(`/goods/newProducts/batchDelete`, ids)
}

export function batchUpdateNewProductStatus(params) {  // ids 批量更新状态研发新品
  return axios.post(`/goods/newProducts/batchUpdateStatus`, params)
}

export function getSources() {  // 获取商品来源信息
  return axios.get(`/goods/newProducts/getSources`)
}

export function getNewProductList(pam) {  // 查询研发新品列表
  return axios.post(`/goods/newProducts/list`, pam)
}
// #endregion

// #region 市面竞品
export function getCompetitiveProductstPager(params) {  // 查询市场竞品分页列表
  return axios.post(`/goods/competitiveProducts/getPager`, params)
}

export function batchDeleteCompetitiveProducts(ids) {  // ids 删除市场竞品
  return axios.post(`/goods/competitiveProducts/batchDelete`, ids)
}

export function addCompetitiveProducts(params) {  // 市场新品新增
  return axios.post(`/goods/competitiveProducts/add`, params)
}

export function updateCompetitiveProducts(params) {  // 市场新品修改
  return axios.post(`/goods/competitiveProducts/update`, params)
}

export function getCompetitiveProductsById(id) {  // id 市场新品详情
  return axios.get(`/goods/competitiveProducts/getOne/${id}`)
}

export function getCompetitiveProductsList(pam) {  // 查询市场竞品列表
  return axios.post(`/goods/competitiveProducts/list`, pam)
}
// #endregion

// #region 商品复核
export function getReviewSkuPager(pam) {  // 查询可复核Sku商品列表
  return axios.post(`/goods/review/getToBeReviewPager`, pam)
}

export function exportToBeReview(params) {  // 导出待复核Sku商品数据
  return axios.post(`/goods/review/exportToBeReview`, params, { responseType: 'blob' })
}

export function isCanReview() {  // 查询是否有权限操作商品复核
  return axios.get(`/goods/review/isCanReview`)
}

export function getReviewSkuLogPager(pam) {  // 查询sku复核记录列表
  return axios.post(`/goods/review/skuReviewLogPager`, pam)
}


export function exportReviewLog(params) {  // 导出Sku复核记录
  return axios.post(`/goods/review/exportReviewLog`, params, { responseType: 'blob' })
}
// #endregion 商品复核

// /goods/competitiveProducts / list
// 产品管理中心 - 查询市场竞品列表




