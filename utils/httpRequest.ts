import axios from 'axios';
import { TOKEN } from '@/constants';
import { message } from 'antd';
import { history } from 'umi';
const axiosInstance = axios.create({});

axiosInstance.interceptors.response.use(
  function (response) {
    const { data } = response;

    return data;
  },
  async function (error) {
    const { response } = error;

    if (response && response.status === 401) {
      localStorage.removeItem(TOKEN);
      localStorage.removeItem('currentWorkSpaceId');
      if (response?.data.message === 'user_not_active') {
        message.error('Tài khoản của bạn đã bị tắt kích hoạt.', 3);
        history.push('/user/login');
      }
    }

    return Promise.reject(error);
  },
);

axiosInstance.interceptors.request.use(
  function (config) {
    config.headers = {
      Authorization: `Bearer ${localStorage.getItem(TOKEN)}`,
    };
    return config;
  },
  async function (error) {
    if (error) {
      localStorage.removeItem(TOKEN);
      localStorage.removeItem('currentWorkSpaceId');
      window.location.href = `/cms/user/login`;
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
