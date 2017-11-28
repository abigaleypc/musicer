<!-- # 豆瓣API

## 登录
- url:  https://www.douban.com/service/auth2/token
- param: 
- method: post
- return: {
    access_token: '208e187284ea558b61aa49578ebf00a1',
    douban_user_name: 'abigaleyu',
    douban_user_id: '168889042',
    expires_in: 7775999,
    refresh_token: 'd92b222b63592a4e8b8166822a0b7eea' 
  }

# 应用API

## 登录

- url:  http://localhost:8082/login
- param: {
  username:'xx',
  password:'xx'
}
- method: post
- return: {
    "code": 1, // 失败：0  成功：1
    "msg": "success",
    douban_user_name:"xx" // 若请求成功，返回douban_user_name
	} -->
