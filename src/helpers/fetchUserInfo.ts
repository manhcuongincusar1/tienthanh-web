import _ from 'lodash';
import { authService } from '@/services/authService';
import { branchesService } from '@/pages/management/services/branchesServices';
import { TOKEN } from '@/constants';
import { history } from 'umi';

export default async function () {
  const loginPath = '/user/login';
  try {
    const currentUser = await authService.getUserInfo();
    const listWorkspace = await branchesService.getListWorkspace();
    if (currentUser) {
      currentUser.currentWorkSpace = null;
    }

    if (
      currentUser &&
      !_.isUndefined(listWorkspace?.branches_list) &&
      !_.isEmpty(listWorkspace?.branches_list) &&
      !_.isEmpty(currentUser?.branch_id)
    ) {
      const currentWorkSpaceIdLocal = localStorage.getItem('currentWorkSpaceId');
      const currentWorkSpace = listWorkspace?.branches_list?.find(
        (item: any) => item?.id === currentWorkSpaceIdLocal,
      );
      currentUser.currentWorkSpace = currentWorkSpace || _.head(listWorkspace?.branches_list);
    }

    return { currentUser, listWorkspace: listWorkspace?.branches_list };
  } catch (error) {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem('currentWorkSpaceId');
    history.push(loginPath);
  }
  return undefined;
}
