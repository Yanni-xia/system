import originAxios from 'axios'

export default function axios(option) {
    const instance = originAxios.create({
      baseURL:  "https://www.liulongbin.top:8888/api/private/v1/",
      timeout: 5000
    });

  instance.interceptors.request.use(config => {
      config.headers.Authorization = window.sessionStorage.getItem('token')
      return config
    }, err => {
      return err
    })

    instance.interceptors.response.use(response => {
      return response.data
    }, err => {
        console.log('来到了response拦截failure中');
        console.log(err);
        if (err && err.response) {
          switch (err.response.status) {
            case 400:
              err.message = '请求错误'
              break
            case 401:
              err.message = '未授权的访问'
              break
          }
        }
        return err
    })

    return instance(option)
}