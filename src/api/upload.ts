import BaseAPI from '@/api/baseAPI';

class Upload extends BaseAPI {
  uploadFile = (body: any): Promise<any> => {
    const data = new FormData();
    data.append('file', body);

    return this.httpApi(`file/upload`, 'post', data, {}).then((res) => {
      if (res.status == 200) {
        return res.data;
      }
    });
  };
  uploadFileMul = (fileList: any): Promise<any> => {
    const data = new FormData();

    fileList.forEach((file: any) => {
      data.append('files', file);
    });

    return this.httpApi(`file/upload-mul`, 'post', data, {}).then((res) => {
      if (res.status == 200) {
        return res.data;
      }
    });
  };
}

export const upload = new Upload();
