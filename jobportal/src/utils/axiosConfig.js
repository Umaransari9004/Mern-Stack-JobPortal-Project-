import axios from 'axios';
import store from '../Store.tsx';

// Add Authorization header to every request using the stored token
axios.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth?.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axios;
