import axios from '@/utils/request'
//获取字典列表
export function getDictionaryList(data) {
  return axios.post('/dictionary/getDictionaryList/goods', data)
}
//获取all字典列表
export function getAllDictionary() {
  return axios.post('/dictionary/getAllDictionary/goods')
}
//新增字典
export function saveDictionary(data) {
    return axios.post('/dictionary/save/goods', data)
}
//修改字典
export function updateDictionary(data) {
  return axios.post('/dictionary/update/goods', data)
}
  //删除
export function deleteDictionary(data) {
    return axios.post('/dictionary/delete', data)
}