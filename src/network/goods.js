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