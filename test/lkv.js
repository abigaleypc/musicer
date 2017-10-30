const expect = require('chai').expect;
const isEqual = require('lodash.isequal');
const {set, get} = require('../utils/lkv');

const key = 'justin';
const data = {
  username: 'justin',
  password: '123456',
  auth_token: 'jfsdkewioibk23jl'
}

describe('local storage test', () => {
  it(`should set data succesfully`, done => {
    set(key, data).then(ret => {
      const retData = ret.data;
      expect(isEqual(data, retData)).to.be.true;
      done();
    });
  });

  it(`should get specified data`, done => {
    get(key).then(ret => {
      expect(isEqual(data, ret)).to.be.true;
      done();
    });
  });
});
