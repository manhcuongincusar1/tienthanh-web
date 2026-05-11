import ProCard from '@ant-design/pro-card';

import { PageContainer } from '@ant-design/pro-layout';
import React, { useRef } from 'react';
import itemRender from '@/helpers/breadcrumbHelper';
import { useIntl } from 'umi';
import AccountForm from '@/pages/account/components/AccountForm';
import { accountService } from '@/api/account/Services/accountService';

const PageDetails: React.FC = () => {
  const intl = useIntl();
  const accountFormRef = useRef();

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
      } = values;

      const res = await accountService.insertAccount({
        districts,
        email,
        full_name,
        raw_phone_number,
        role,
        sell_price_range,
        rent_price_range,
        branch_id: branch_id,
      });
      return res;
    },
  };

  return (
    <PageContainer
      header={{
        breadcrumb: {
          itemRender,
          routes: [
            {
              path: '/',
              breadcrumbName: intl.formatMessage({ id: 'global.home' }),
            },
            {
              path: 'account/list',
              breadcrumbName: intl.formatMessage({
                id: 'pages.account.list',
              }),
            },
            {
              path: 'create',
              breadcrumbName: intl.formatMessage({ id: 'pages.account.create_member' }),
            },
          ],
        },
      }}
      title={intl.formatMessage({ id: 'pages.account.create_member' })}
    >
      <ProCard headerBordered title="Thông tin thành viên">
        <AccountForm ref={accountFormRef} handleForm={_func.handleForm} />
      </ProCard>
    </PageContainer>
  );
};

export default PageDetails;
