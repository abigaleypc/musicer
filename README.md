# douban.fm
electron + ReactJS + Redux

## 启动项目
* 安装依赖 npm install
* 启动 npm start

## 后端数据存储格式

* 登录信息 `LKV.set(`${username}_token_info`, data)`
* 基本信息 `LKV.set(`${username}_basic_info`, data)`
* 敏感信息 `LKV.set(`${username}_sensitive_info`, data)`
