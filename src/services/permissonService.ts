import BaseService from './baseService';
import { apiPermission } from '@/api/permissions/api';
type RoleDataUpdate = { id: string; title?: string };
class PermissionService extends BaseService {
  updatePermission = async (roleData: RoleDataUpdate, permission_data: any): Promise<any> => {
    return apiPermission
      .updatePermission(roleData, permission_data)
      .then((res) => {
        if (res.status == 200) {
          return res.data;
        }
      })
      .catch((err) => {
        if (err?.response?.data.status === 404) {
          return { keyResponse: 'notfound' };
        }
        return { keyResponse: err?.response?.data?.message };
      });
  };
  getPermissionList = async (): Promise<any> => {
    return apiPermission
      .getPermissionList()
      .then((res) => {
        if (res.status == 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return undefined;
      });
  };
  getPermissionByRole = async (): Promise<any> => {
    return apiPermission
      .getPermissionByRole()
      .then((res) => {
        if (res.status == 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return undefined;
      });
  };
  getPermissionById = async (id: string): Promise<any> => {
    return apiPermission
      .getPermissionById(id)
      .then((res) => {
        if (res.status == 200) {
          return res.data;
        }
      })
      .catch((err) => {
        if (err?.response?.data.status === 404) {
          return { keyResponse: 'notfound' };
        }
        return { keyResponse: err?.response?.data?.message };
      });
  };
}

export const permissionService = new PermissionService();
