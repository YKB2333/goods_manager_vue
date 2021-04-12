import Cookies from 'js-cookie'
import { cookieExpires } from '@/config'

export function getToken() {
  return Cookies.get('Admin-Token')
}

export function setToken(token) {
  Cookies.set('Admin-Token', token, { expires: cookieExpires })
}