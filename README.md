# douban.fm
electron + ReactJS + Redux

## 启动项目
* 安装依赖 npm install
* 启动 npm start

## 后端数据存储格式

* 登录信息 `LKV.set(`${username}_token_info`, data)`
* 基本信息 `LKV.set(`${username}_basic_info`, data)`
* 敏感信息 `LKV.set(`${username}_sensitive_info`, data)`

## 后端获取敏感顺序

> 打开 `src/routes/user.js` 文件，个人信息的获取与修改需要具备四个参数：ac bdl2 ck bid , 可以从请求基本信息 `/basic?username=xxx&password=xxx&token=xxx` 获取，通过请求头部获取敏感信息，顺序如下

`/basic?username=xxx&password=xxx&token=xxx` --> `getUserAc()` --> `serveceAcount()`  -->  `getDouBanFm()`  --> `getUserBid()`  --> `getUserAc()`
