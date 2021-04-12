import axios from '@/utils/request'

// #region 问卷列表
export function getQuestionnairePager(params) {  // 试用调查问卷列表
  return axios.post(`/goods/questionnaire/getPager`, params)
}

export function batchDeleteQuestionnaire(ids) {  // 批量删除试用调查问卷
  return axios.post(`/goods/questionnaire/batchDelete`, ids)
}

export function batchPublishQuestionnaire(ids) {  // 批量发布试用调查问卷
  return axios.post(`/goods/questionnaire/batchPublish`, ids)
}

export function batchStopQuestionnaire(ids) {  // 批量停止试用调查问卷
  return axios.post(`/goods/questionnaire/batchStop`, ids)
}

export function exportQuestionnaire(params) {  // 批量导出试用调查问卷信息列表
  return axios.post(`/goods/questionnaire/export`, params, { responseType: 'blob' })
}

export function getQuestionnaireById(id) {  // 获取试用调查问卷
  return axios.get(`/goods/questionnaire/getOne/${id}`)
}

export function addQuestionnaire(params) {  // 添加试用调查问卷
  return axios.post(`/goods/questionnaire/add`, params)
}

export function updateQuestionnaire(params) {  // 修改试用调查问卷
  return axios.post(`/goods/questionnaire/update`, params)
}

export function exportUserAnswer(id) {  // 导出试用调查问卷用户答卷数据
  return axios.get(`/goods/questionnaire/exportUserAnswer/${id}`, { responseType: 'blob' })
}
// /goods/questionnaire / exportUserAnswer / { questionnaireId }
// 产品管理中心 - 导出试用调查问卷用户答卷数据
// #endregion

// #region 问卷模板
export function getTemplatePager(params) {  // 试用调查问卷模板分页列表
  return axios.post(`/goods/questionnaireTemplete/getPager`, params)
}

export function exportTemplate(params) {  // 批量导出试用调查问卷模板信息
  return axios.post(`/goods/questionnaireTemplete/export`, params, { responseType: 'blob' })
}

export function batchDeleteTemplate(ids) {  // 批量删除试用调查问卷模板
  return axios.post(`/goods/questionnaireTemplete/batchDelete`, ids)
}

export function addTemplate(params) {  // 添加试用调查问卷模板
  return axios.post(`/goods/questionnaireTemplete/add`, params)
}

export function updateTemplate(params) {  // 修改试用调查问卷模板
  return axios.post(`/goods/questionnaireTemplete/update`, params)
}

export function getTemplateById(id) {  // 获取试用调查问卷模板
  return axios.get(`/goods/questionnaireTemplete/getOne/${id}`)
}

export function getTemplateByCateCode(cateCode) {  // 试用分类关联调查问卷模板列表
  return axios.get(`/goods/questionnaireTemplete/listByCateCode/${cateCode}`)
}

// #endregion
