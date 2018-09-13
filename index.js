require('isomorphic-fetch');

let common_url = 'https://www.easy-mock.com/mock/5b993124c395314e38ddc2c3/example/';
let token = '';

/**
 * 将正常的fetch和延时fetch通过race方法进行封装
 * @param {Promise} fetchPromise  正常的fetch函数，返回一个Promise对象
 * @param {number} [timeout=5000]   判定fetch失败的延时时间，默认5秒，单位为毫秒
 * @returns 返回封装了延迟判断的Promise
 */
function fetchTimeout(fetchPromise, timeout = 5000) {
  let timeoutFn = null;
  let timeoutPromise = new Promise(function (resolve, reject) {
    timeoutFn = function () {
      reject('timeout promise');
    };
  });
  let abortablePromise = Promise.race([
    fetchPromise,
    timeoutPromise
  ]);
  setTimeout(function () {
    timeoutFn();
  }, timeout);
  return abortablePromise;
}

/**
 * 发送GET和POST请求ajax数据
 * @param {string} url ajax访问接口地址
 * @param {string} method 支持GET、POST方法，必须大写
 * @param {JSON} [params=''] POST请求时，body的请求参数，默认为空
 * @returns 返回ajax请求Promise
 */
function fetchRequest(url, method, params = '') {
  let header = {
    "Content-Type": "application/json;charset=UTF-8",
    "accesstoken": token
  };
  console.log('request url:', common_url + url, params);
  if (params === '') {
    return new Promise(function (resolve, reject) {
      fetchTimeout(fetch(common_url + url, {
        method: method,
        headers: header
      }))
        .then((response) => response.json())
        .then((responseData) => {
          // console.log('res:', url, responseData);
          resolve(responseData);
        })
        .catch((err) => {
          // console.log('err:', url, err);     
          reject(err);
        });
    });
  } else {
    return new Promise(function (resolve, reject) {
      fetchTimeout(fetch(common_url + url, {
        method: method,
        headers: header,
        body: JSON.stringify(params)
      }))
        .then((response) => response.json())
        .then((responseData) => {
          // console.log('res:', url, responseData);
          resolve(responseData);
        })
        .catch((err) => {
          // console.log('err:', url, err);
          reject(err);
        });
    });
  }
}
fetchRequest('mock', 'GET')
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  })