import axios, { AxiosInstance } from 'axios';

import APP_CONSTANT from '../constants';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: APP_CONSTANT.BASE_URL,
});

export default axiosInstance;
