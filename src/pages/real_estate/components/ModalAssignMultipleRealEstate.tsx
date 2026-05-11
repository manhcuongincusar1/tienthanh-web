import { useIntl } from 'umi';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import ProFormAutocomplete from '@/components/Custom/ProFormAutocomplete';
import { useState, useRef } from 'react';
import { userService } from '@/services/userService';
import { ProFormInstance } from '@ant-design/pro-form';
import { useModel } from 'umi';
import { message } from 'antd';
import _ from 'lodash';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';

type SearchOptions = {
  label: string;
  value: string;
};

type UserInfo = {
  full_name: string;
  raw_phone_number: string;
  username: string;
  id: string;
};

type ModalAsignRealEstateProps = {
  realEstateListToAssign: RealEstate.RealEstateListToAssignList | [];
  hidden: boolean;
  handleRefreshPage: () => void;
  localePage: string;
  realEstateService: any;
};

export default function ModalAsignRealEstate({
  realEstateListToAssign,
  handleRefreshPage,
  hidden,
  localePage,
  realEstateService,
}: ModalAsignRealEstateProps) {
  const intl = useIntl();
  const formRef = useRef<ProFormInstance>();
  const [visibleModal, setVisibleModal] = useState(false);
  const { handleResponseEditRealEstate } = useModel('realEstateSell');
  const { initialState } = useModel('@@initialState');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const workspace_id = getWorkspaceId(initialState);

  const [searchOptions, setSearchOptions] = useState<SearchOptions[]>([]);
  const _func = {
    onSearchUser: async (value: any) => {
      if (value) {
        const response = await userService.getUserInfoToAssignRealEstate(value, workspace_id);
        const newSearchOptions = response?.map((item: UserInfo) => {
          const { raw_phone_number, username, id: user_id, full_name } = item;
          const labelAndValue = raw_phone_number + ', ' + username;
          return {
            label: labelAndValue,
            value: labelAndValue,
            id: user_id,
            full_name: full_name,
            phone_number: raw_phone_number,
            username: username,
          };
        });
        setSearchOptions(newSearchOptions);
      } else {
        setSearchOptions([]);
      }
    },
    onChangeSearchUser: async (value: any, options: any) => {
      if (options && options?.username) {
        const { phone_number, full_name, username, id: user_id } = options;
        formRef.current?.setFieldsValue({
          phone_number: phone_number,
          full_name: full_name,
          username: username,
          user_id: user_id,
        });
      } else {
        formRef.current?.setFieldsValue({
          phone_number: undefined,
          full_name: undefined,
          username: undefined,
        });
      }
    },
    onFinish: async (data: any) => {
      const { full_name: next_saler_full_name, user_id } = data;
      let isValidRealEstateList = true;

      if (_.isArray(realEstateListToAssign) && !_.isEmpty(realEstateListToAssign)) {
        const newRealEstateListToAssign: any = realEstateListToAssign.map((itemRealEstate) => {
          const {
            real_estate_status_id,
            real_estate_status,
            sale_full_name,
            sale_phone,
            broker_full_name,
            broker_phone_number,
            id,
          } = itemRealEstate;
          if (id && user_id && real_estate_status_id) {
            return {
              real_estate_status_id: real_estate_status_id,
              real_estate_status_title: real_estate_status,
              saler_full_name: sale_full_name,
              saler_phone_number: sale_phone,
              broker_full_name: broker_full_name,
              broker_phone_number: broker_phone_number,
              user_id: user_id,
              branch_id: workspace_id,
              real_estate_id: id,
              next_saler_full_name: next_saler_full_name,
            };
          } else {
            isValidRealEstateList = false;
            return null;
          }
        });
        if (newRealEstateListToAssign && isValidRealEstateList) {
          const responseAssignRealEstate: string | any =
            await realEstateService.assignMultipleRealEstateToUser(
              newRealEstateListToAssign,
              workspace_id,
            );

          const isMultipleAssignItem = newRealEstateListToAssign?.length > 1;

          handleResponseEditRealEstate(
            {
              response: responseAssignRealEstate,
              handleRefreshPage: () => {
                setVisibleModal(false);
                formRef.current?.resetFields();
                handleRefreshPage();
              },
              handlePushPageToPageList: handleRefreshPage,
              intl,
            },
            {
              localeActionSuccessId: 'pages.real_estate_sale.assign_success',
              localeForbiddenId: 'pages.real_estate_sale.delivered',
              localeActionFailedId: 'pages.real_estate_sale.assign_failed',
              localeDuplicateId: isMultipleAssignItem
                ? `pages.${localePage}.duplicated_multiple`
                : `pages.${localePage}.duplicated`,
              localeDeleteId: isMultipleAssignItem
                ? `pages.${localePage}.deleted_multiple`
                : `pages.${localePage}.deleted`,
            },
          );
        }
      }
    },
    checkIsValidRealEstateListToAssign: (realEstateList: RealEstate.RealEstateListToAssignList) => {
      const isValidRealEstateList =
        _.isArray(realEstateList) &&
        realEstateList?.some((realEstate) => !realEstate?.real_estate_status_id);

      if (isValidRealEstateList) {
        return false;
      }
      return true;
    },
  };

  return (
    <ModalForm
      formRef={formRef}
      onFinish={_func.onFinish}
      trigger={
        <Button
          hidden={hidden}
          onClick={() => {
            if (_func.checkIsValidRealEstateListToAssign(realEstateListToAssign)) {
              setVisibleModal(true);
            } else {
              const messageError =
                _.isArray(realEstateListToAssign) && realEstateListToAssign?.length > 1
                  ? 'pages.real_estate_sale.invalid_real_estate_list_action'
                  : 'pages.real_estate_sale.invalid_real_estate_action';
              message.error(
                intl.formatMessage({
                  id: messageError,
                }),
                MESSAGE_DISPLAY_SECONDS.ERROR,
              );
            }
          }}
          style={{ marginRight: '16px' }}
          shape="circle"
        >
          Chuyển BĐS
        </Button>
      }
      visible={visibleModal}
      modalProps={{
        onCancel: () => {
          formRef.current?.resetFields();
          setVisibleModal(false);
        },
        width: '600px',
      }}
      submitter={false}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '20px', fontWeight: '600' }}>
          {intl.formatMessage({ id: 'pages.real_estate_sale.title_modal_assign' })}
        </span>
      </div>
      <ProFormAutocomplete
        fieldProps={{
          options: searchOptions || [],
          onSearch: _func.onSearchUser,
          onChange: _func.onChangeSearchUser,
        }}
        name="search_phone_number"
        placeholder="Tìm kiếm SĐT/Email"
        suffix={
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.33594 1.66732C3.75861 1.66732 1.66927 3.75666 1.66927 6.33398C1.66927 8.91131 3.75861 11.0007 6.33594 11.0007C7.59323 11.0007 8.7344 10.5034 9.57353 9.69491C9.59108 9.67209 9.6103 9.65015 9.6312 9.62925C9.6521 9.60835 9.67404 9.58912 9.69686 9.57158C10.5054 8.73245 11.0026 7.59128 11.0026 6.33398C11.0026 3.75666 8.91327 1.66732 6.33594 1.66732ZM11.0239 10.0791C11.845 9.05266 12.3359 7.75066 12.3359 6.33398C12.3359 3.02028 9.64964 0.333984 6.33594 0.333984C3.02223 0.333984 0.335938 3.02028 0.335938 6.33398C0.335938 9.64769 3.02223 12.334 6.33594 12.334C7.75261 12.334 9.05461 11.843 10.0811 11.0219L12.5312 13.4721C12.7915 13.7324 13.2137 13.7324 13.474 13.4721C13.7344 13.2117 13.7344 12.7896 13.474 12.5292L11.0239 10.0791Z"
              fill="rgb(29, 30, 32)"
            />
          </svg>
        }
      />
      <ProFormText
        name="full_name"
        label={intl.formatMessage({ id: 'pages.real_estate_sale.recipients_name' })}
        placeholder={intl.formatMessage({ id: 'pages.real_estate_sale.recipients_name' })}
        disabled
      />
      <ProFormText
        name="username"
        label={intl.formatMessage({ id: 'pages.real_estate_sale.recipients_email' })}
        placeholder={intl.formatMessage({ id: 'pages.real_estate_sale.recipients_email' })}
        disabled
      />
      <ProFormText
        name="phone_number"
        label={intl.formatMessage({ id: 'pages.real_estate_sale.recipients_phone_number' })}
        placeholder={intl.formatMessage({ id: 'pages.real_estate_sale.recipients_phone_number' })}
        disabled
      />
      <ProFormText name="user_id" hidden disabled />
      <Space style={{ justifyContent: 'center', width: '100%' }}>
        <Button
          shape="circle"
          onClick={() => {
            setVisibleModal(false);
            formRef.current?.resetFields();
          }}
        >
          Huỷ
        </Button>
        <Button
          shape="circle"
          type="primary"
          onClick={() => {
            formRef?.current?.submit();
          }}
        >
          Chuyển
        </Button>
      </Space>
    </ModalForm>
  );
}
