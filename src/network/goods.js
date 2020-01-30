import axios from './axios'

// 获取商品分类数据列表
export function getCateData(data) {
  return axios({
    url: 'categories',
    params: data
  })
}

// 添加分类
export function postCate(data) {
  return axios({
    url: 'categories',
    method: 'POST',
    data: data
  })
}

// 获取分类参数列表
export function getCateAttr(id, param) {
  return axios({
    url: 'categories/' + id + '/attributes',
    params: { sel: param }
  })
}

// 添加动态参数或者静态属性
export function postParam(id, name, sel) {
  return axios({
    url: 'categories/' + id + '/attributes',
    method: 'POST',
    data: {
      attr_name: name,
      attr_sel: sel
      }
  })
}

// 根据 ID 查询参数
export function getEditAttr(id, attrId, sel) {
  return axios({
    url: 'categories/' + id + '/attributes/' + attrId,
    params: {attr_sel: sel}
  })
}

// 编辑提交参数
export function putParams(id, attrId, name, sel) {
  return axios({
    url: 'categories/'+ id + '/attributes/' + attrId,
    method: 'PUT',
    data: {
      attr_name: name,
      attr_sel: sel
    }
  })
}
// 编辑提交参数属性值
export function putAttr(id, attrId, name, sel, vals) {
  return axios({
    url: 'categories/'+ id + '/attributes/' + attrId,
    method: 'PUT',
    data: {
      attr_name: name,
      attr_sel: sel,
      attr_vals: vals
    }
  })
}

// 删除参数
export function deleteAttr(id, attrid) {
  return axios({
    url: 'categories/' + id + '/attributes/' + attrid,
    method: 'DELETE'
  })
}

// 获取商品列表数据
export function getGoodsList(data) {
  return axios({
    url: 'goods',
    params: data
  })
}

// 删除商品
export function deleteGoods(id) {
  return axios({
    url: 'goods/' + id,
    method: 'DELETE'
  })
}

// 添加商品
export function postGoods(data){
  return axios({
    url: 'goods',
    method: 'POST',
    data: data
  })
}