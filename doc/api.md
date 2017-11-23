# 豆瓣API

## 登录
- url:  https://www.douban.com/service/auth2/token
- param: 
- method: post
- return: {
    "access_token": "8eee318225f87941acca948671e96bc3",
    "douban_user_name": "Abigale",
    "douban_user_id": "145429791",
    "expires_in": 7775999,
    "refresh_token": "05259377a9f9aeb70f70ba66fded0c25"
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
	}
