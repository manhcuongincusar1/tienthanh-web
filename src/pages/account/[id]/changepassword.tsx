import ProCard from '@ant-design/pro-card';

import { PageContainer } from '@ant-design/pro-layout';
import { useRef } from 'react';
import { useIntl, useModel } from 'umi';
import { message } from 'antd';
import { accountService } from '@/api/account/Services/accountService';
import ChangePasswordForm from '@/pages/account/components/ChangePasswordForm';
import { history } from '@@/core/history';
import _ from 'lodash';
import CryptoJS from 'crypto-js';
import defaultSettings from '../../../../config/defaultSettings';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';
import useHandleResponseFromCallApi from '@/helpers/handleResponseFromApi';

const EditForm = ({ match: { params } }: object) => {
  const { id } = params;
  const { handleResponseFromCallApi } = useHandleResponseFromCallApi();
  const intl = useIntl();
  const changePasswordFormRef = useRef();
  const { initialState } = useModel('@@initialState');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const workspace_id = getWorkspaceId(initialState);
  const _func = {
    handleForm: async (values: object | any) => {
      try {
        if (!_.isUndefined(values.password)) {
          const encryptText = CryptoJS.AES.encrypt(
            values.password,
            defaultSettings?.secretKey,
          ).toString();
          const response = await accountService.updateAccountPassword(id, {
            password: encryptText,
            branch_id: workspace_id,
          });

          if (response?.keyResponse) {
            handleResponseFromCallApi({ response: response.keyResponse });
            return;
          }
          if (response.status === 200) {
            message.success(`Thành công`, MESSAGE_DISPLAY_SECONDS.SUCCESS, () => {
              history.push(`/account/edit/${id}`);
            });
          } else {
            message.error(`Thất bại`, MESSAGE_DISPLAY_SECONDS.ERROR);
          }
        }
      } catch (error) {
        message.error(`Thất bại`, MESSAGE_DISPLAY_SECONDS.ERROR);
      }
    },
  };

  return (
    <PageContainer
      header={{
        ghost: true,
      }}
      title={'Cập nhật lại mật khẩu'}
    >
      <ProCard headerBordered title="Cập nhật lại mật khẩu">
        <ChangePasswordForm ref={changePasswordFormRef} handleForm={_func.handleForm} userId={id} />
      </ProCard>
    </PageContainer>
  );
};

export default EditForm;
