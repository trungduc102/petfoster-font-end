import { getTokenFromCookie } from '@/utils/cookie';
import axios from 'axios';

const axiosConfig = axios.create({
    baseURL: 'http://localhost:8019/api/',
    timeout: 4000,
    headers: {
        'Content-type': 'application/json; charset=utf-8',
    },
});

// Add a request interceptor
axiosConfig.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        const token = getTokenFromCookie();

        if (!token || token === '' || token === 'null') {
            return config;
        } else {
            config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    },
);

// Add a response interceptor
axiosConfig.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
    },
);

export default axiosConfig;
