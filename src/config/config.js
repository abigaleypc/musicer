exports.httpHeader = {
  'Accept': 'text/javascript, text/html, application/xml, text/xml, */*',
  'X-Requested-With': 'XMLHttpRequest',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
  'Content-Type': 'application/x-www-form-urlencoded',
  'Referer': 'https://douban.fm/',
  'Accept-Encoding': 'utf-8',
  'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6'
}

exports.doubanComHeader = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'Host': 'www.douban.com',
  'Pragma': 'no-cache',
  'Referer': 'https://douban.fm/',
  'Upgrade-Insecure-Requests': 1,
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
}

exports.doubanFmHeader = {
  'Host': 'douban.fm',
  'Connection': 'keep-alive',
  'Pragma': 'no-cache',
  'Cache-Control': 'no-cache',
  'Accept': 'text/javascript, text/html, application/xml, text/xml, */*',
  'X-Requested-With': 'XMLHttpRequest',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
  'Content-Type': 'application/x-www-form-urlencoded',
  'Referer': 'https://douban.fm/',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
}

exports.AuthKey = {
  apikey: '02646d3fb69a52ff072d47bf23cef8fd',
  client_id: '02646d3fb69a52ff072d47bf23cef8fd',
  client_secret: 'cde5d61429abcd7c',
  udid: 'b88146214e19b8a8244c9bc0e2789da68955234d',
  douban_udid: 'b635779c65b816b13b330b68921c0f8edc049590',
  device_id: 'b88146214e19b8a8244c9bc0e2789da68955234d',
  grant_type: 'password',
  redirect_uri: 'http://www.douban.com/mobile/fm'
}

exports.access_token = '0a95c075f8a9d30d1fc14161e9fd7927'

exports.loginUrl = 'https://www.douban.com/service/auth2/token'
exports.nextSongUrl='http://douban.fm/j/v2/playlist'
exports.likeSongUrl='https://douban.fm/j/v2/playlist'
exports.deleteSongUrl='https://douban.fm/j/v2/playlist'
exports.recentPlayedUrl='https://douban.fm/j/v2/recent_played_songs'
exports.playlistUrl = 'https://api.douban.com/v2/fm/playlist'
exports.lyricUrl = 'https://douban.fm/j/v2/lyric'
exports.basicUrl = 'https://accounts.douban.com/j/popup/login/basic'
exports.doubanFmUrl = 'https://douban.fm'
exports.userCkUrl = 'https://douban.fm/j/check_loggedin?san=1'

exports.PORT = 65534;
