import axios from '@/utils/request'

export function getAttachmentList(data) { // 商品附件分页查询
  return axios.post('/attachment/selectPage', data)
}

export function downloadAtta(url) { // 下载
  return axios.get(url, {
    responseType: 'blob'
  })
}

export function deleteAtta(id) {
  return axios.delete(`/attachment/delAttachment/${id}`)
}