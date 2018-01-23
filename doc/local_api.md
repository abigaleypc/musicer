
# 应用API

## 登录

- url:  http://localhost:8082/user/login
- param: {
  username:13798994068,
  password:123456c
}
- method: get
- return: {
    <!--  失败：0  成功：1 -->
    "code": 1, 
    "msg": "success", // failed
    "data" : {  
      <!-- 成功：1  -->
      "code": 1,
      "msg": "success",
      "data": {
          "access_token": "25a64943770f2dbca55d46995",
          "douban_user_name": "abigaleyu",
          "douban_user_id": "1688842",
          "expires_in": 7775999,
          "refresh_token": "5f2388c502a9a4f0799f2f9"
      }
      <!-- 失败 0 -->
      "code": -1,
      "msg": "failed"
    }  
	} 


## 根据token登录

- url:  http://localhost:8082/user/loginByToken
- param: {
  username:13798994068,
  token:xxxxxxx
}
- method: get
- return: {
    <!--  失败：0  成功：1 -->
    "code": 1, 
    "msg": "success", // failed
    "data" : {  
      <!-- 成功：1  -->
      "access_token": "25a64943770f2dbca55d46995",
      "douban_user_name": "abigaleyu",
      "douban_user_id": "1688842",
      "expires_in": 7775999,
      "refresh_token": "5f2388c502a9a4f0799f2f9"
    }  
    <!-- 失败 0 -->
    "code": -1,
    "msg": "failed"
	} 

## 获取基本信息

- url:  http://localhost:8082/user/basic
- param: {
  username:13798994068,
  password:123456c,
  captcha_id:从上一次该接口请求返回获取 (可选)
  captcha_solution:输入的验证码 (可选)
}
- method: get
- return: {
    <!-- 成功：1  --> 
    "code": 1, 
    "msg": "success", // failed
    "data" : { 
      "avatar": {
          "medium": "https://img3.doubanio.com/icon/up168889042-1.jpg",
          "median": "https://img3.doubanio.com/icon/us168889042-1.jpg",
          "large": "https://img3.doubanio.com/icon/ul168889042-1.jpg",
          "raw": "https://img3.doubanio.com/icon/ur168889042-1.jpg",
          "small": "https://img3.doubanio.com/icon/u168889042-1.jpg",
          "icon": "https://img3.doubanio.com/icon/ui168889042-1.jpg"
        },
        "id": "168889042",
        "name": "abigaleyu",
        "uid": "168889042"
      }
    } 

    <!-- 需要验证码 -1 -->
    "code": -1,
    "msg": "captcha_required",
    "data": {
      "captcha_signature_sample": "17:c,18:6",
      "captcha_id": "login:captcha:uCvABcP9I6TVVJ959yJAzYCf",
      "captcha_image_url": "https://accounts.douban.com/j/captcha/show?vid=login:captcha:uCvABcP9I6TVVJ959yJAzYCf&size=small"
    }
    
    <!-- 失败 0 -->
    "code": -1,
    "msg": "failed" 
	} 

## 采用token登录

- url:  http://localhost:8082/user/loginByToken
- param: {
  id:1eqweq68,
  token:123456c
}
- method: get
- return: {
    <!-- 成功：1  --> 
    "code": 1, 
    "msg": "success", // failed
    "data" : { 
        "avatar": {
        "medium": "https://img3.doubanio.com/icon/up168889042-1.jpg",
        "median": "https://img3.doubanio.com/icon/us168889042-1.jpg",
        "large": "https://img3.doubanio.com/icon/ul168889042-1.jpg",
        "raw": "https://img3.doubanio.com/icon/ur168889042-1.jpg",
        "small": "https://img3.doubanio.com/icon/u168889042-1.jpg",
        "icon": "https://img3.doubanio.com/icon/ui168889042-1.jpg"
      },
      "id": "168889042",
      "name": "abigaleyu",
      "uid": "168889042"   
    } 
      
    <!-- 失败 0 -->
    "code": 0,
    "msg": "无效token，请重新登录"
    }  
	} 
