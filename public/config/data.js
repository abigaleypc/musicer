export const PANELS = [{
  str: 'LOGIN',
  title: '登录'
}, ,{
  str: 'REDHEAD',
  title: '红心'

}];

export const REQUEST_CONTENT = {
  LOGIN: {
    url: 'http://localhost:8082/user/login',
    params: { username: '13798994068', password: '1234567890ypc' },
    method: 'POST'
  },
  LOGINBYTOKEN: {
    url: 'http://localhost:8082/user/loginByToken',
    params: {  },
    method: 'GET'
  },
  REDHEAD: {
    url: 'http://localhost:8082/user/login',
    params: { username: '13798994068', password: '1234567890ypc' },
    method: 'GET'
  }
}

