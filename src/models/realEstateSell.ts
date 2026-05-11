import { realEstateService } from '@/services/realEstateService';
import { realEstateStatusService } from '@/services/realEstateStatusService';
import { ProFormInstance } from '@ant-design/pro-form';
import { UploadFile, message } from 'antd';
import { useState, useEffect, MutableRefObject, useReducer } from 'react';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';
import { useModel } from 'umi';

const pathPage = [
  { key: 'sell', path: 'real-estate-sell', locale: 'real_estate_sale', type: 1 },
  {
    path: 'real-estate-rent',
    key: 'rent',
    locale: 'real_estate_rent',
    type: 2,
  },
];
type HandleResponseEditRealEstateProps = {
  handleRefreshPage: () => void;
  handlePushPageToPageList: () => void;
  response: string;
  intl: any;
};

type HandleResponseEditRealEstateMessage = {
  localeActionSuccessId: string;
  localeForbiddenId: string;
  localeActionFailedId: string;
  localeDuplicateId: string;
  localeDeleteId: string;
};

interface TypePage {
  key: string;
  path: string;
  locale: string;
  type: number;
}

interface PreviousStatus {
  id?: string;
  title?: string;
}

export default () => {
  const [visibleAlert, setVisibleAlert] = useState<boolean>(false);
  const [realEstateStatus, setRealEstateStatus] = useState<
    RealEstateSell.RealEstateStatusOptions[]
  >([]);
  const [formRefRealEstate, setFormRefRealEstate] =
    useState<MutableRefObject<ProFormInstance<any> | undefined>>();
  const [forceUpdate, setForceUpdate] = useState<number>(0);
  const [prevEstateStatusId, setPrevEstateStatusId] = useState<string | undefined>('');
  const [showInternal, setShowInternal] = useState<boolean | undefined>(false);
  const [parentRealEstateId, setParentRealEstateId] = useState<string>('');
  const [requiredStatus, setRequiredStatus] = useState<boolean>(true);
  const [previousStatusText, setPreviousStatusText] = useState<PreviousStatus | undefined>(
    undefined,
  );
  const [isVisibleModalNote, setIsVisibleModalNote] = useState<boolean>(false);
  const [typePage, setTypePage] = useState<TypePage | undefined>();
  const [listPathUrl, setListPathUrl] = useState<UploadFile[] | []>();
  const [isAgency, setIsAgency] = useState<boolean>(false);
  const { initialState, setInitialState } = useModel('@@initialState');
  const initialStateProperty = {
    detail: {},
  };

  const funcReducer = (state: any, action: any) => {
    switch (action.type) {
      case 'updateDetail':
        return { ...state, detail: action.detail };
        break;
      default:
        throw new Error();
    }
  };
  const [state, dispatch] = useReducer(funcReducer, initialStateProperty);
  const handleChangePage = (pathname: string) => {
    pathPage.forEach((value) => {
      if (pathname.includes(value.path)) setTypePage(value);
    });
  };
  const handleHideAlert = (
    formRef?: MutableRefObject<ProFormInstance<any> | undefined>,
    update?: boolean | undefined,
  ) => {
    setVisibleAlert(false);
    if (!update) {
      formRef?.current?.setFieldsValue({
        real_estate_status_id: realEstateStatus.find(
          (value) => value.type === typePage?.type && value.isDefault,
        )?.value,
      });
    }
  };

  const checkDuplicateRealEstate = async (
    formRef?: MutableRefObject<ProFormInstance<any> | undefined>,
    realEstateId?: string,
    type?: number,
    branch_id?: string,
  ): Promise<boolean | undefined> => {
    const administrative = formRef?.current?.getFieldsValue([
      'province_city_id',
      'district_id',
      'street_id',
      'ward_id',
      'real_estate_status_id',
      'address',
    ]);

    const { province_city_id, district_id, ward_id, street_id, address, real_estate_status_id } =
      administrative;
    if (province_city_id && district_id && ward_id && street_id && address) {
      const response = await realEstateService.checkDuplicateRealEstate({
        district_id: district_id,
        province_city_id,
        street_id,
        ward_id,
        address: address.trim(),
        type: type || 1,
        real_estate_status_id: real_estate_status_id,
        real_estate_id: realEstateId,
        branch_id,
      });

      if (!response?.is_duplicate || response.real_estate_id === parentRealEstateId) {
        handleHideAlert(formRef, !!realEstateId);
        setRequiredStatus(true);

        return true;
      } else if (response?.is_duplicate) {
        setVisibleAlert(true);
        formRef?.current?.setFieldsValue({
          real_estate_status_id: undefined,
        });
        setRequiredStatus(false);
        return false;
      } else {
        handleHideAlert(formRef, !!realEstateId);
        setRequiredStatus(true);
        return true;
      }
    } else {
      if (visibleAlert && realEstateId) {
        handleHideAlert(formRef, !!realEstateId);
        setRequiredStatus(true);
        return true;
      }
    }
    return false;
  };

  const updateProperties = (properties: object) => {
    dispatch({
      type: 'updateDetail',
      detail: properties,
    });
  };

  const handleRealEstateStatus = async (typePage: number) => {
    return await realEstateStatusService
      .getListRealEstateStatus({
        type: typePage,
      })
      .then((res) => {
        if (res?.data) {
          const realEstateStatusOptions = res.data.reduce(
            (prev: RealEstateSell.RealEstateStatusOptions[], value) => {
              return [
                ...prev,
                {
                  value: value.id,
                  label: value.title,
                  color: value.color,
                  type: typePage,
                  isDefault: value.is_default,
                  isEditableRe: value.is_editable_re,
                  isShowInternal: value.is_show_internal,
                },
              ];
            },
            [],
          );
          setRealEstateStatus(realEstateStatusOptions);
          return realEstateStatusOptions;
        }
      });
  };
  useEffect(() => {
    if (prevEstateStatusId) {
      const realEstateStatusDefault = realEstateStatus.find(
        (value) => value.value === prevEstateStatusId,
      );
      setShowInternal(realEstateStatusDefault?.isShowInternal ? true : false);
    }
  }, [prevEstateStatusId]);
  const { detail } = state;

  const handleResponseEditRealEstate = (
    responseDataTohandle: HandleResponseEditRealEstateProps,
    responseLocaleIdMessage: HandleResponseEditRealEstateMessage,
  ) => {
    const {
      localeActionSuccessId,
      localeForbiddenId,
      localeActionFailedId,
      localeDuplicateId,
      localeDeleteId,
    } = responseLocaleIdMessage;
    const { response, handleRefreshPage, handlePushPageToPageList, intl } = responseDataTohandle;
    switch (response) {
      case 'forbidden':
        message.error(intl.formatMessage({ id: localeForbiddenId }), MESSAGE_DISPLAY_SECONDS.ERROR);
        handlePushPageToPageList();
        break;
      case 'forbidden_branch':
        message.error(
          intl.formatMessage({ id: 'global.forbidden' }),
          MESSAGE_DISPLAY_SECONDS.ERROR,
        );
        let currentUser = initialState?.currentUser;
        if (currentUser) {
          currentUser.permission_data = false;
        }
        setInitialState((s: any) => ({ ...s, currentUser }));
        break;
      case 'success':
        message.success(
          intl.formatMessage({ id: localeActionSuccessId }),
          MESSAGE_DISPLAY_SECONDS.SUCCESS,
          () => {
            handleRefreshPage();
          },
        );
        break;
      case 'duplicate':
        message.error(intl.formatMessage({ id: localeDuplicateId }), MESSAGE_DISPLAY_SECONDS.ERROR);
        handlePushPageToPageList();
        break;
      case 'delete':
        message.error(intl.formatMessage({ id: localeDeleteId }), MESSAGE_DISPLAY_SECONDS.ERROR);
        handlePushPageToPageList();
        break;
      case 'notfound':
        message.error(
          intl.formatMessage({ id: localeActionFailedId }),
          MESSAGE_DISPLAY_SECONDS.ERROR,
        );
        handlePushPageToPageList();
        break;
      default:
        message.error(
          intl.formatMessage({ id: localeActionFailedId }),
          MESSAGE_DISPLAY_SECONDS.ERROR,
        );
        break;
    }
  };

  return {
    visibleAlert,
    setVisibleAlert,
    realEstateStatus,
    prevEstateStatusId,
    setPrevEstateStatusId,
    showInternal,
    setShowInternal,
    forceUpdate,
    setForceUpdate,
    handleRealEstateStatus,
    setRealEstateStatus,
    parentRealEstateId,
    setParentRealEstateId,
    checkDuplicateRealEstate,
    handleHideAlert,
    requiredStatus,
    formRefRealEstate,
    setFormRefRealEstate,
    previousStatusText,
    setPreviousStatusText,
    isVisibleModalNote,
    setIsVisibleModalNote,
    listPathUrl,
    setListPathUrl,
    typePage,
    handleChangePage,
    typePageDefault: pathPage,
    isAgency,
    setIsAgency,
    detailProperties: detail,
    updateProperties,
    handleResponseEditRealEstate,
  };
};
