import axios from 'axios';
import { TOKEN } from '@/constants';
import { message } from 'antd';
import { history } from 'umi';

// S5/02: app dùng JWT Bearer header (localStorage), KHÔNG cookie session.
// → withCredentials = false. Cross-origin gọi `tienthanhapi.datviet.ai` từ
// `tienthanh.datviet.ai` chỉ cần BE CORS allow origin (Authorization là simple
// header sau preflight). Nếu sau này đổi sang cookie auth → bật withCredentials
// + đồng bộ Set-Cookie Domain=.datviet.ai bên BE.
const axiosInstance = axios.create({
  withCredentials: false,
});

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
      // S5/09: cross-tab logout broadcast (registered ở app.tsx, lazy global).
      try { (window as any).__titaOnLogout?.(); } catch (_e) {}
      if (response?.data.message === 'user_not_active') {
        message.error('Tài khoản của bạn đã bị tắt kích hoạt.', 3);
        history.push('/user/login');
      }
    } else if (response && response.status === 403) {
      // S5/09: permission có thể vừa đổi server-side, refresh để banner show.
      try { (window as any).__titaOnForbidden?.(); } catch (_e) {}
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
