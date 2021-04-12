import axios from '@/utils/request'

export function getLogList(data) { // 操作日志列表
  return axios.post(`/goods/opLog/page`, data)
}