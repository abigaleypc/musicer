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
    return JSON.parse(Crypto.AES.decrypt(data, secret).toString(Crypto.enc.Utf8));
}

/**
 * save to local key value
 * @param key
 * @param value
 * @param expireTime never expire if not set (unit: second)
 * @returns {Promise}
 */
function set(key, data, expireTime) {
    !fs.existsSync(lkvDir) && fs.mkdirSync(lkvDir);
    !fs.existsSync(lkvPath) && fs.writeFileSync(lkvPath, `{}`);

    let kvs = fs.readFileSync(lkvPath);
    kvs = JSON.parse(kvs.toString());

    let storedData = {
        data,
        createTime: (+new Date() / 1000).toFixed(), // use second as unit
        expireTime
    };
    kvs[key] = storedData;

    fs.writeFileSync(lkvPath, JSON.stringify(kvs));

    return storedData;
}

/**
 * get all values
 * @returns {Promise}
 */
function getAll() {
    return new Promise((resolve, reject) => {
        fs.readFile(lkvPath, (err, kvs) => {
            if (err) {
                console.error(err)
                return reject(err);
            }

            try {
              kvs = JSON.parse(kvs.toString());
            } catch (error) {
              console.error(error);
            }

            resolve(kvs);
        });
    });
}

/**
 * get all data sync
 */
function getAllSync() {
    let kvs = fs.readFileSync(lkvPath)

    try {
        kvs = JSON.parse(kvs.toString());
    } catch (error) {
        console.error(error);
    }

    return kvs;
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
 * get specified value by key sync
 * @param {string} key
 */
function getSync(key) {
    let value = getAllSync()[key];

    if (_isValid(value)) {
        return value.data;
    } else {
        return null;
    }
}

/**
 * check the data is valid or not
 * @param data
 * @returns {boolean}
 * @private
 */
function _isValid(data) {
    if (!data) return false;

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
exports.getAllSync = getAllSync;
exports.getSync = getSync;
