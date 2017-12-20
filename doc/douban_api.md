# 豆瓣API

## 登录
- url:  https://www.douban.com/service/auth2/token
- param: {
    username: username,
    password: password
  }
- method: post
- return: {
    access_token: '208e18723238b61aa49578ebf00a1',
    douban_user_name: 'abigaleyu',
    douban_user_id: '168889042',
    expires_in: 7775999,
    refresh_token: 'd9243263592a4e8b8166822a0b7eea' 
  }

## 获取基本信息
- url:  https://accounts.douban.com/j/popup/login/basic
- param: {
    source: fm
    referer: https://douban.fm/
    ck: L-UM
    name: username
    password: password
    captcha_solution: null
    captcha_id: null
  }
- method: post
- return: {
    <!-- 获取成功 -->
    {
      "status": "success",
      "message": "success",
      "description": "处理成功",
      "payload": {
        "account_info": {
          "avatar": {
            "medium": "https://img3.doubanio.com\/icon\/up168889042-1.jpg",
            "median": "https://img3.doubanio.com\/icon\/us168889042-1.jpg",
            "large": "https://img3.doubanio.com\/icon\/ul168889042-1.jpg",
            "raw": "https://img3.doubanio.com\/icon\/ur168889042-1.jpg",
            "small": "https://img3.doubanio.com\/icon\/u168889042-1.jpg",
            "icon": "https://img3.doubanio.com\/icon\/ui168889042-1.jpg"
          },
          "id": "168889042",
          "name": "abigaleyu",
          "uid": "168889042"
        }
      }
    }
    <!-- 获取失败  根据图片输入验证码再次请求 -->
    "status": "failed",
    "message": "captcha_required",
    "description": "需要图形验证码",
    "payload": {
        "captcha_signature_sample": "17:c,18:6",
        "captcha_id": "login:captcha:uCvABcP9I6TVVJ959yJAzYCf",
        "captcha_image_url": "https://accounts.douban.com/j/captcha/show?vid=login:captcha:uCvABcP9I6TVVJ959yJAzYCf&size=small"
    }
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
