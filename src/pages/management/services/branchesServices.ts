import BaseService from '@/services/baseService';
import { branches } from '@/api/branches';
class BranchesService extends BaseService {
  /**
  Get List Workspace
  **/
  getListWorkspace = (): Promise<Record<string, any>> => {
    return branches
      .getListWorkspace()
      .then((res) => {
        if (res.status == 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return { status: 404 };
      });
  };
}

export const branchesService = new BranchesService();
