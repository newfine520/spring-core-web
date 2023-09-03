
(function(win){
    //const baseUrl = 'http://192.168.0.103:25288'

win.service = service = axios.create({
  timeout: 600000,
})

service.interceptors.request.use((config) => {
  config.headers = {
    'Content-Type':'application/json'}
  return config
}, (error) => {
  return Promise.reject(error)
})

service.interceptors.response.use((response) => {
  return response;
}, (error)=> {
  return Promise.reject(error);
})


})(window)
