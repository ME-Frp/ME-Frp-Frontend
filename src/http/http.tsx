import axios from 'axios'
import Router from 'next/router'
import Message from '../../components/Message'
import api from '../config/config'

const baseURL = api.api
axios.defaults.baseURL= baseURL,
axios.defaults.timeout= 10000,

axios.interceptors.request.use(
    (config) => {
        if (config.headers === undefined) {
            config.headers = {}
        }

        config.headers['Accept'] = 'application/json'
        config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token')
        return Promise.resolve(config)
    },
    (error) => {
        console.error(error)
        return Promise.reject(error)
    }
)

axios.interceptors.response.use(
  (res) => {
    return Promise.resolve(res);
  },
  (error) => {
    console.error('Axios error', error);
    let data = [];

    if (error.response.data.data) {
      data = error.response.data.data;
    }

    if (error.response.data.message) {
      data = error.response.data.message;
    }

    if (error.response.data.error) {
      data = error.response.data.error.message;
    }
    if (error.response.status === 429) {
        Message.error({content: "请求次数过多！", duration: 2000})
    } else if (error.response.status === 401) {
      if (location.pathname !== '/') {
        if (location.pathname !== '/auth/login') {
            if (localStorage.getItem('token') !== null) { 
                Message.error({content: "您的登录状态已失效，无权访问此页面，正在为您重新登录……", duration: 2000}) 
            } else {
        Message.error({content: "您还未登录，无权访问此页面，正在重新登录……", duration: 2000})
        }
        Router.push("/auth/login")
        }
      }
    } else if (error.response.status === 404) {
      Message.error({content: "LaeCloud API Error 404",duration: 2000})
    } else {
      if (data.length !== 0) {
        Message.error({content: data,duration: 2000})
      }
    }
    return Promise.resolve(error);
  }
);
/**
 * 封装get方法
 * @param url  请求url
 * @param params  请求参数
 * @returns {Promise}
 */
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
        params: params,
      }).then((response) => {
        landing(url, params, response.data);
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(
      (response) => {
        //关闭进度条
        resolve(response.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data).then(
      (response) => {
        resolve(response.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data).then(
      (response) => {
        resolve(response.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

//统一接口处理，返回数据
export default function http (fecth, url,data) {
  let _data = "";
  return new Promise((resolve, reject) => {
    switch (fecth) {
      case "get":
        get(url)
          .then(function (response) {
            resolve(response);
          })
          .catch(function (error) {
            reject(error);
          });
        break;
      case "post":
        post(url,data)
          .then(function (response) {
            resolve(response);
          })
          .catch(function (error) {
            reject(error);
          });
        break;
      default:
        break;
    }
  });
}


/**
 * 查看返回的数据
 * @param url
 * @param params
 * @param data
 */
function landing(url,param, data) {
  if (data.code === -1) {
  }
}
