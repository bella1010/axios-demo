import Vue from "vue";
import axios from "axios";
import service from "./ContactApi";
import { Toast } from "vant";

Vue.use(Toast);

("use strict");
// servise 循环遍历输出不停的请求方法
let instance = axios.create({
  baseURL: "http://localhost:9000/api",
  timeout: 1000
});
// 包裹请求方法的容器
const Http = {};

// 请求格式/参数的统一
for (let key in service) {
  // url method
  let api = service[key];

  // async 的作用：避免进入回调地狱
  Http[key] = async function(
    // 请求参数 get(url),put,post,patch(data),detete(url)
    params,
    // 标识是否是 form-data请求
    isFormData = false,
    // 配置参数
    config = {}
  ) {
    // let url = api.url
    let newParams = {};

    // content-type 是否是 form-data
    if (params && isFormData) {
      newParams = new FormData();
      for (let i in params) {
        newParams.append(key, params[i]);
      }
    } else {
      newParams = params;
    }
    // 不同请求的判断
    // 请求的返回值
    let response = {};
    if (
      api.method === "put" ||
      api.method === "post" ||
      api.method === "patch"
    ) {
      try {
        response = await instance[api.method](api.url, newParams, config);
      } catch (err) {
        response = err;
      }
    } else if (api.method === "delete" || api.method === "get") {
      config.params = newParams;
      try {
        response = await instance[api.method](api.url, config);
      } catch (err) {
        response = err;
      }
    }
    // 返回相应值
    return response;
  };
}

// 拦截器的添加-请求拦截器
instance.interceptors.request.use(
  config => {
    // 发起请求前做什么
    Toast.loading({
      mask: false,
      duration: 0, //一直存在
      forbidClick: true, // 禁止点击
      message: "加载中..."
    });
    return config;
  },
  err => {
    // 请求错误
    Toast.clear();
    Toast("请求错误");
    console.log(err);
  }
);

// 拦截器的添加-响应拦截器
instance.interceptors.response.use(
  res => {
    // 请求成功
    Toast.clear();
    return res.data;
  },
  err => {
    // 请求错误
    Toast.clear();
    Toast("响应失败");
    console.log(err);
  }
);

export default Http;
