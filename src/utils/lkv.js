const fs = require('fs');
const path = require('path');
const Crypto = require("crypto-js");

// local key value storage
const lkvDir = path.join(__dirname, '../data');
const lkvPath = path.join(lkvDir, 'lkv');

function encrypt(data) {
    const secret = 'lkv';
    return Crypto.AES.encrypt(JSON.stringify(data), secret);
}

function decrypt(data) {
    const secret = 'lkv';
    // return JSON.parse(Crypto.AES.decrypt(data, secret).toString(Crypto.enc.Utf8));
}

/**
 * save to local key value
 * @param key
 * @param value
 * @param overwrite overwrite if the key has exist
 * @param expireTime never expire if not set (unit: second)
 * @returns {Promise}
 */
function set(key, data, overwrite = true, expireTime) {
    !fs.existsSync(lkvDir) && fs.mkdirSync(lkvDir);
    !fs.existsSync(lkvPath) && fs.writeFileSync(lkvPath, encrypt({}));

    return new Promise((resolve, reject) => {
        getAll().then(kvs => {
            if (kvs[key] && !overwrite) {
                reject({
                    errCode: 1000,
                    msg: `${key} has exist`
                });
            }

            let storedData = {
                data,
                createTime: (+new Date() / 1000).toFixed(), // use second as unit
                expireTime
            };
            kvs[key] = storedData;

            fs.writeFile(lkvPath, encrypt(kvs), err => {
                if (err) {
                    reject({
                        errCode: -2,
                        msg: err
                    });
                }
                resolve(storedData);
            });
        }).catch(err => {
            reject({
                errCode: -1,
                msg: err
            });
        });
    });
}

/**
 * get all values
 * @returns {Promise}
 */
function getAll() {
    return new Promise((resolve, reject) => {
        fs.readFile(lkvPath, (err, kvs) => {
            if (err) {
                reject(err);
            }
            resolve(decrypt(kvs.toString()));
        });
    });
}

/**
 * get specified value by key
 * @param key
 * @returns {Promise}
 */
function get(key) {
    return new Promise((resolve, reject) => {
        getAll().then(kvs => {
            let value = kvs[key];

            if (_isValid(value)) {
                resolve(value.data);
            } else {
                reject({
                    errCode: -1001,
                    msg: 'not found'
                });
            }
        }).catch(err => {
            reject({
                errCode: -1,
                msg: err
            });
        });
    });
}

/**
 * check the data is valid or not
 * @param data
 * @returns {boolean}
 * @private
 */
function _isValid(data) {
    let {
        createTime,
        expireTime
    } = data;
    let nowTime = +new Date();

    // no expireTime means to be valid forever
    if (!expireTime) {
        return true;
    }

    return (createTime + expireTime >= nowTime);
}

exports.set = set;
exports.getAll = getAll;
exports.get = get;
