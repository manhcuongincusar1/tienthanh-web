import BaseAPI from '@/api/baseAPI';

const path = 'branches';

class Branches extends BaseAPI {
  getBranchesList = (body: any): Promise<any> => {
    return this.httpApi(`branches/get-list`, 'get', { params: { ...body } }, {}).then((res) => {
      if (res.status == 200) {
        return res.data;
      }
    });
  };
  deleteBranch = (body: any): Promise<any> => {
    const { id } = body;
    return this.httpApi(`branches/delete/${id}`, 'put', {}, {})
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return err;
      });
  };
  createBranch = (body: any): Promise<any> => {
    return this.httpApi('branches/create', 'post', body, {})
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return err;
      });
  };
  udpateBranchById = (id: number, body: any): Promise<any> => {
    return this.httpApi(`branches/update/${id}`, 'put', body, {})
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return err;
      });
  };
  updateStatusById = (id: number, body: any): Promise<any> => {
    return this.httpApi(`branches/update-status/${id}`, 'put', body, {})
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return err;
      });
  };
  checkCodeTax = (body: any): Promise<any> => {
    return this.httpApi('branches/check-tax', 'post', body, {})
      .then((res) => {
        if (res.status == 200) {
          return res;
        } else {
          return res;
        }
      })
      .catch((err) => {
        return err;
      });
  };

  /*
  Get List Workspace
  */
  getListWorkspace = (): Promise<API.MpireResponse> => {
    return this.httpApi(`${path}/workspace`, 'get', {}, {});
  };
}

export const branches = new Branches();
