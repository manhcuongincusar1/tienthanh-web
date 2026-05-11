import { history } from 'umi';
import { stringify } from 'querystring';
import { TOKEN } from '@/constants';

const handleLogOut = async () => {
  const { query = {}, search, pathname } = history.location;
  const { redirect } = query;
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem('real-estate-rent');
    localStorage.removeItem('real-estate-sell');
    localStorage.removeItem('currentWorkSpaceId');
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname + search,
      }),
    });
  }
};

export default handleLogOut;
