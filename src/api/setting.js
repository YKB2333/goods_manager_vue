import axios from '@/utils/request'

/**
 * 同步出库单
 */
export function syncOutbill(data) {
  return axios.put(`/goods/setting/syncOutbill`, data)
}

/**
 * 统计出库单
 */
export function statOutbill(data) {
  return axios.put(`/goods/setting/statOutbill`, data)
}

/**
 * 同步采购单
 */
export function syncCgOrder(upd) {
  return axios.put(`/goods/setting/syncCgOrder?upd=${upd}`)
}

/**
 * 统计采购单
 */
export function statCgOrder(data) {
  return axios.put(`/goods/setting/statCgOrder`, data)
}