import axios from './axios'

export function getReportData() {
  return axios({
    url: 'reports/type/1'
  })
}