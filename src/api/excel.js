import axios from '@/utils/request'

export function exportSpu(params) {  // 导出spu-Excel
  return axios.post(`/goods/spu/exportSpu`, params, { responseType: 'blob' })
}

export function importSpu(formData) {  // 导入spu-Excel
  return axios.post(`/goods/spu/importSpu`, formData)
}
export function batchUpdateSpus(formData) {  // 批量导入
  return axios.post(`/goods/spu/batchUpdateSpus`, formData)
}
export function batchUpdateSpus4Admin(formData) {  // 批量导入
  return axios.post(`/goods/spu/batchUpdateSpus4Admin`, formData)
}

export function exportCategory() {  // 导出category-Excel
  return axios.post(`/goods/category/exportCategory`, {}, { responseType: 'blob' })
}

export function exportNewCategory() {  // 导出new category-Excel
  return axios.post(`/goods/newProductsCategory/exportCategory`, {}, { responseType: 'blob' })
}

export function exportCensusSpu(params) {  // 导出spu信息统计-Excel
  return axios.post(`/goods/spu/exportCensusSpu`, params, { responseType: 'blob' })
}

export function exportSkuCostPrice(params) {  // 导出成本价 参数同列表
  return axios.post(`/goods/costPrice/downLoad`, params, { responseType: 'blob' })
}

export function exportSkuCostPriceTemplate() {  // 下载Sku成本价导入模版
  return axios.get(`/goods/costPrice/exportTemplate`,  { responseType: 'blob' })
}

export function exportQuestionnaire(questionnaireId) {  // 下载Sku成本价导入模版
  return axios.get(`/goods/questionnaire/exportUserAnswer/${questionnaireId}`,  { responseType: 'blob' })
}
// exportTemplate

export function exportNewProducts(params) {  // 下载研发新品信息
  return axios.post(`/goods/newProducts/export`, params, { responseType: 'blob' })
}

export function exportCompetitiveProducts(params) {  // 下载市面竞品信息
  return axios.post(`/goods/competitiveProducts/export`, params, { responseType: 'blob' })
}