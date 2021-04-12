import axios from '@/utils/request';

export function uploadFile(url, file) {
  return axios.post(url, file)
}