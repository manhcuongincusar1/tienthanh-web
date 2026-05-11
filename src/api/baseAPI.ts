import axiosInstance from '../../utils/httpRequest';
import Settings from '../../config/defaultSettings';

type ResultWithData<T = any> = {
  data?: T;
  [key: string]: any;
};

class BaseAPI {
  /**
   *
   * @param url
   * @param type
   * @param variables
   * @param options
   */
  async http<R extends ResultWithData = any, P extends any[] = any>(
    url: string = '',
    type: string = '',
    variables: object = {},
    options: object = {},
  ): Promise<any> {
    return axiosInstance[type](url, variables, options);
  }

  /**
   *
   * @param url
   * @param type
   * @param variables
   * @param options
   */
  httpApi = async (url: string, type = 'post', variables: object, options: object) => {
    return this.http<API.MpireResponse>(`${Settings.APP_API}/${url}`, type, variables, options);
  };
}

export default BaseAPI;
