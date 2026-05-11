import ProCard from '@ant-design/pro-card';

import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useRef, useState } from 'react';
import itemRender from '@/helpers/breadcrumbHelper';
import { useIntl, useModel } from 'umi';
import AccountForm from '@/pages/account/components/AccountForm';
import { accountService } from '@/api/account/Services/accountService';
import { formatDateTime } from '@/utils/dateUtils';
import { STATUS_ENUM } from '@/constants';
import { useParams } from 'umi';
import useHandleResponseFromCallApi from '@/helpers/handleResponseFromApi';

type Params = {
  id: string;
};

interface InitialValues {
  id: string;
  email: string;
  raw_phone_number: string;
  full_name: string;
  status: boolean;
  role: string;
  last_login: string | null;
  districts: number[];
  province_city: number;
  sell_price_range: number[];
  rent_price_range: number[];
  is_editable: boolean;
}

const EditForm = () => {
  const { id } = useParams<Params>();
  const intl = useIntl();
  const accountFormRef = useRef();
  const { initialState } = useModel('@@initialState');
  const { handleResponseFromCallApi } = useHandleResponseFromCallApi();
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const workspace_id: string = getWorkspaceId(initialState);
  const [accountData, setAccountData] = useState<InitialValues | undefined>();
  const [forceUpdate, setForceUpdate] = useState<number>(0);
  const _func = {
    handleForm: async (values: any) => {
      const {
        districts,
        email,
        full_name,
        raw_phone_number,
        role,
        sell_price_range,
        rent_price_range,
        branch_id,
        id,
        status,
      } = values;
      const res = await accountService.updateAccount({
        branch_id: branch_id,
        districts,
        email,
        full_name,
        raw_phone_number,
        role,
        sell_price_range,
        rent_price_range,
        id,
        status,
      });
      return res;
    },
  };

  useEffect(() => {
    accountService.getAccountById(id, workspace_id).then(({ data, keyResponse }: any) => {
      console.log(keyResponse);

      if (keyResponse) {
        handleResponseFromCallApi({ response: keyResponse });
      }
      if (data) {
        const initialValuesNew: InitialValues = {
          id: data?.user_id,
          email: data?.email,
          raw_phone_number: data?.raw_phone_number,
          full_name: data?.full_name,
          status: data?.status === STATUS_ENUM.ACTIVE,
          role: data?.roles?.[0],
          last_login: data?.last_login ? formatDateTime(data.last_login) : null,
          districts: data?.districts?.filter((district: any) => district),
          province_city: data?.province_city?.[0],
          sell_price_range: [data?.sell_price_from, data?.sell_price_to],
          rent_price_range: [data?.rent_price_from, data?.rent_price_to],
          is_editable: data?.is_editable,
        };

        setAccountData(initialValuesNew);
      }
    });
  }, [id, forceUpdate]);

  return (
    <PageContainer
      header={{
        ghost: true,
        breadcrumb: {
          itemRender,
          routes: [
            {
              path: '/',
              breadcrumbName: 'Trang chủ',
            },
            {
              path: '/account/list',
              breadcrumbName: intl.formatMessage({
                id: 'pages.account.list',
              }),
            },
            {
              path: '',
              breadcrumbName: intl.formatMessage({
                id: 'pages.account.information',
              }),
            },
          ],
        },
      }}
      title={intl.formatMessage({ id: 'pages.account.edit_information' })}
    >
      <ProCard headerBordered title="Thông tin thành viên">
        {accountData?.id && (
          <AccountForm
            ref={accountFormRef}
            handleForm={_func.handleForm}
            detailAccountData={accountData}
            setForceUpdate={setForceUpdate}
          />
        )}
      </ProCard>
    </PageContainer>
  );
};

export default EditForm;
