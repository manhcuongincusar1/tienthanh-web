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

type ModalAsignSingleRealEstateProps = {
  handlePushPageToPageList: () => void;
  handleRefreshPage: () => void;
  realEstateId: string;
  localePage: string;
  realEstateService: any;
};

export default function ModalAsignSingleRealEstate({
  handlePushPageToPageList,
  handleRefreshPage,
  realEstateId,
  localePage,
  realEstateService,
}: ModalAsignSingleRealEstateProps) {
  const intl = useIntl();
  const formRef = useRef<ProFormInstance>();
  const [visibleModal, setVisibleModal] = useState(false);
  const { detailProperties, handleResponseEditRealEstate } = useModel('realEstateSell');
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
      const {
        real_estate_status_id,
        real_estate_status,
        saler_full_name,
        saler_phone_number,
        broker_full_name,
        broker_phone_number,
      } = detailProperties;

      const dataAssign: API.DataAssignRealEstateItem = {
        real_estate_status_id: real_estate_status_id,
        real_estate_status_title: real_estate_status,
        saler_full_name: saler_full_name,
        saler_phone_number: saler_phone_number,
        broker_full_name: broker_full_name,
        broker_phone_number: broker_phone_number,
        next_saler_full_name: next_saler_full_name,
        user_id: user_id,
        branch_id: workspace_id,
        real_estate_id: realEstateId,
      };
      const responseAssignRealEstate: string | any =
        await realEstateService.assignRealEstateSingleToUser(dataAssign, workspace_id);
      handleResponseEditRealEstate(
        {
          response: responseAssignRealEstate,
          handleRefreshPage: () => {
            setVisibleModal(false);
            formRef.current?.resetFields();
            handleRefreshPage();
          },
          handlePushPageToPageList,
          intl: intl,
        },
        {
          localeActionSuccessId: 'pages.real_estate_sale.assign_success',
          localeForbiddenId: `pages.${localePage}.delivered_detail`,
          localeActionFailedId: 'pages.real_estate_sale.assign_failed',
          localeDuplicateId: `pages.${localePage}.duplicated_detail`,
          localeDeleteId: `pages.${localePage}.deleted_detail`,
        },
      );
    },
  };

  return (
    <ModalForm
      formRef={formRef}
      onFinish={_func.onFinish}
      trigger={
        <Space
          size="middle"
          align="center"
          onClick={() => {
            const isValidRealEstateToAssign = !!detailProperties?.real_estate_status_id;
            if (isValidRealEstateToAssign) {
              setVisibleModal(true);
            } else {
              message.error(
                intl.formatMessage({
                  id: 'pages.real_estate_sale.invalid_real_estate_action',
                }),
                MESSAGE_DISPLAY_SECONDS.ERROR,
              );
              handlePushPageToPageList && handlePushPageToPageList();
            }
          }}
          style={{ fontSize: '16px' }}
        >
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2.33398 1.66683C2.15717 1.66683 1.9876 1.73707 1.86258 1.86209C1.73756 1.98712 1.66732 2.15668 1.66732 2.3335V11.6668C1.66732 11.8436 1.73756 12.0132 1.86258 12.1382C1.9876 12.2633 2.15717 12.3335 2.33398 12.3335H5.00065C5.36884 12.3335 5.66732 12.632 5.66732 13.0002C5.66732 13.3684 5.36884 13.6668 5.00065 13.6668H2.33398C1.80355 13.6668 1.29484 13.4561 0.919771 13.081C0.544698 12.706 0.333984 12.1973 0.333984 11.6668V2.3335C0.333984 1.80306 0.544698 1.29436 0.919771 0.919282C1.29484 0.54421 1.80355 0.333496 2.33398 0.333496H5.00065C5.36884 0.333496 5.66732 0.631973 5.66732 1.00016C5.66732 1.36835 5.36884 1.66683 5.00065 1.66683H2.33398ZM9.19591 3.19543C9.45626 2.93508 9.87837 2.93508 10.1387 3.19543L13.4721 6.52876C13.7324 6.78911 13.7324 7.21122 13.4721 7.47157L10.1387 10.8049C9.87837 11.0653 9.45626 11.0653 9.19591 10.8049C8.93556 10.5446 8.93556 10.1224 9.19591 9.86209L11.3912 7.66683H5.00065C4.63246 7.66683 4.33398 7.36835 4.33398 7.00016C4.33398 6.63197 4.63246 6.3335 5.00065 6.3335H11.3912L9.19591 4.13823C8.93556 3.87788 8.93556 3.45577 9.19591 3.19543Z"
                fill="#1D1E20"
              />
            </svg>
          </span>
          Chuyển BĐS
        </Space>
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
            formRef.current?.resetFields();
            setVisibleModal(false);
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
