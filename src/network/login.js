import axios from './axios'

export function loginPost(data){
  return axios({
    url: 'login',
    method: 'POST',
    data: data
  })
}