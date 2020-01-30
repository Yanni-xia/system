import axios from './axios'

export function getOrderData(data) {
  return axios({
    url: 'orders',
    params: data
  })
}

export function getProgressData() {
  return axios({
    url: '/kuaidi/1106975712662'
  })
}