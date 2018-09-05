import axios from 'axios';
import router from '../router';
import ElementUI from 'element-ui';

let that = this;

let instance = axios.create({
    baseURL: process.env.BASE_API,
    timeout: 300000,
    headers: {
        'X-Custom-Header': 'foobar',
    }
});

// 添加请求拦截器
instance.interceptors.request.use((config) => {
    // 在发送请求之前做些什么
    if (localStorage.getItem("userInfo")) {
        var token = JSON.parse(localStorage.getItem("userInfo")).token;
        config.headers.Token = token;
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use((response) => {
    // 对响应数据做点什么
    let resolve = {};
    resolve.data = response.data.result;
    resolve.row = response.data;
    if (!resolve.row.success && resolve.row.error_code === 7) {
        localStorage.removeItem("userInfo");
        // ElementUI.Message.error(resolve.row.error_msg);
        router.push({
            path: "/login",
        });

        // return null;
    }
    return resolve;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default instance;