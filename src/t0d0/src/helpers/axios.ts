import axios from 'axios'

export const myAxios = axios.create({
    baseURL: 'http://localhost:3000',
});

myAxios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {

        if (error.response.data && error.response.data.error) {
            alert(error.response.data.error);
        }

        if (error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

myAxios.interceptors.request.use(function (config) {
    config.headers['authorization'] = `Bearer ${localStorage.getItem('token')}`;
    config.headers['Content-Type'] = 'application/json'
    return config;
}, function (error) {
    return Promise.reject(error);
});