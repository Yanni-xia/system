import axios from './axios'

export function homeData(){
  return axios({
    url: 'menus'
  })
}

export function getUserListData(data) {
  return axios({
    url: 'users',
    params: data
  })
}

export function addUsers(data) {
  return axios({
    url: 'users',
    method: 'POST',
    data: data
  })
}

export function putStatus(uId, type) {
  return axios({
    url: 'users/' + uId + '/state/' + type,
    method: 'PUT'
  })
}

// 获取编辑用户数据
export function getEditData(id) {
  return axios({
    url: 'users/' + id
  })
}
// 提交编辑用户数据
export function commitEditData(id, data) {
  return axios({
    url: 'users/' + id,
    method: 'PUT',
    data: data
  })
}