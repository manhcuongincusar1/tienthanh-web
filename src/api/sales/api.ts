import BaseAPI from '@/api/baseAPI';

class ApiSale extends BaseAPI {
  getSaleList = (): Promise<any> => {
    return this.httpApi('sale/list', 'get', {}, {})
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return { status: 404 };
      });
  };

  checkRangePriceSell = (sell_price: number): Promise<any> => {
    return this.httpApi(
      'sale/check-sell',
      'get',
      {
        params: {
          sell_price,
        },
      },
      {},
    )
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return false;
      });
  };
}

export const apiSale = new ApiSale();
