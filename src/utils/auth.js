import Cookies from 'js-cookie'

const TokenKey = 'shicai'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function setsessionInfo(info){
  return sessionStorage.setItem(TokenKey, info)
}
export function getsessionInfo(){
  return sessionStorage.getItem(TokenKey)
}