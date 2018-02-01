


export function getAccountList () {
  let str = /musicer_(\w+)_info/g
  let keys = Object.keys(localStorage)
  let accountList = []
  for (let i = 0; i < keys.length; i++) {
    const matchList = keys[i].match(str)
    if (matchList.length > 0) {
      accountList.push(matchList[0])
    }
  }
  return accountList
}


// export function getUserInfo () {
// }

export function getToken (username) {
}
