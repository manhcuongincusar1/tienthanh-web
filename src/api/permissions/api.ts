import BaseAPI from '@/api/baseAPI';

type RoleDataUpdate = {
  id: string;
  title?: string;
};
class ApiPermission extends BaseAPI {
  updatePermission = ({ id, title }: RoleDataUpdate, permission_data: any): Promise<any> => {
    return this.httpApi(`permission/update/${id}`, 'post', { permission_data, title }, {});
  };
  getPermissionList = (): Promise<any> => {
    return this.httpApi('permission/get', 'get', {}, {});
  };
  getPermissionByRole = (): Promise<any> => {
    return this.httpApi('permission/role', 'get', {}, {});
  };
  getPermissionById = (id: string): Promise<any> => {
    return this.httpApi(`permission/get/${id}`, 'get', {}, {});
  };
}

export const apiPermission = new ApiPermission();
