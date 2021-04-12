import axios from '@/utils/request'

export function getMaterialList(spuId) { // 根据spuId获取素材列表
  return axios.get(`/materialController/findMaterialList/${spuId}`)
}

export function addMaterial(data) { // 添加素材,type:0图片，1视频
  return axios.post(`/materialController/addMaterial`, data)
}

export function updateMaterial(data) { // 修改素材
  return axios.post(`/materialController/updateMaterial`, data)
}

export function deleteMaterial(materialId) { // 删除素材
  return axios.delete(`/materialController/deleteMaterial/${materialId}`)
}