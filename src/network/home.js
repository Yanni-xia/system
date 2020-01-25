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

// 删除用户
export function deleteUserData(id) {
  return axios({
    url: 'users/' + id,
    method: 'DELETE'
  })
}
// 分配用户角色
export function putRoles(id, rid) {
  return axios({
    url: 'users/' + id + '/role',
    method: 'PUT',
    data: rid
  })
}

// 权限列表
export function getRightData() {
  return axios({
    url: 'rights/list',
  })
}

// 分配权限列表
export function getRightDataTree() {
  return axios({
    url: 'rights/tree',
  })
}

// 角色列表
export function getRoleData() {
  return axios({
    url: 'roles'
  })
}

// 删除角色指定权限
export function deleteRoleRight(roleId, rightId) {
  return axios({
    url: 'roles/' + roleId + '/rights/' + rightId,
    method: 'DELETE'
  })
}

// 添加角色权限
export function addRoleRight(roleId, rightId) {
  return axios({
    url: 'roles/' + roleId + '/rights',
    method: 'POST',
    data: rightId
  })
}