import request from '@/utils/request'

var baseURL='http://106.75.101.90:1288/';

export function login(data) {
  return request({
    url: baseURL+'user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
