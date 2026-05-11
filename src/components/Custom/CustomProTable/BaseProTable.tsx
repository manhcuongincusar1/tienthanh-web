import type { ActionType, ProColumns, ProTableProps } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Input, ConfigProvider, Space, message, Upload } from 'antd';
import Settings from '../../../../config/defaultSettings';
import type { ProFormInstance } from '@ant-design/pro-form';
import { useIntl } from '@@/plugin-locale/localeExports';
import _ from 'lodash';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { realEstateService } from '@/services/realEstateService';
import { useModel } from 'umi';
import useHandleResponseFromCallApi from '@/helpers/handleResponseFromApi';
import EmptyDataTable from '../EmptyDataTable';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';

const BaseProTable = forwardRef((props: ProTableProps<ProColumns, object> | any, ref) => {
  const tableFormRef = useRef<ProFormInstance>();
  const actionRef = useRef<ActionType>();
  const { actions = {}, optionToolbar, initParams } = props;
  const intl = useIntl();
  const [importFile, setImportFile] = useState(null);
  const [paramss, setParamss] = useState(initParams);
  const { initialState } = useModel('@@initialState');
  const [isLoadingUpload, setIsLoadingUpload] = useState<boolean>(false);
  const { handleResponseFromCallApi } = useHandleResponseFromCallApi();
  const currentUser = initialState?.currentUser;
  const {} = actions;
  const { search = false, upload = false } = optionToolbar;
  useImperativeHandle(ref, () => ({
    submitFormSearch() {
      tableFormRef?.current?.submit();
    },
    getFieldValue(name: string) {
      return tableFormRef?.current?.getFieldValue(name);
    },
    getFieldsValue() {
      return tableFormRef?.current?.getFieldsValue();
    },
    setFieldsValue(object: object) {
      tableFormRef?.current?.setFieldsValue(object);
    },
    onValuesChange: () => {
      actionRef?.current?.onValuesChange();
    },
    setFields(list: any) {
      tableFormRef?.current?.setFields(list);
    },
    resetFieldsValue: () => {
      tableFormRef?.current?.resetFields();
    },
    reloadTable: () => {
      actionRef?.current?.reload();
    },
    reloadAndRestTable: () => {
      actionRef?.current?.reloadAndRest();
    },
    pageInfo: () => {
      return actionRef?.current?.pageInfo;
    },
    setPageInfo: (object: object) => {
      const pageInfo = actionRef?.current?.pageInfo;
      actionRef?.current?.setPageInfo({...pageInfo, ...object});
    },
    getSearchParams: () => {
      return paramss;
    },
  }));
  const _thisProps: ProTableProps<ProColumns, object> = {
    rowKey: 'id',
    params: paramss,
    search: {
      span: {
        xs: 24,
        sm: 24,
        md: 12,
        lg: 12,
        xl: 8,
        xxl: props?.searchSpan ? props.searchSpan : 6,
      },
      layout: 'vertical',
      optionRender: (searchConfig, formProps, dom) => {
        return [
          <Button key="reset" shape="circle" type="primary" {...dom[0]?.props}>
            Xoá bộ lọc
          </Button>,
        ];
      },
      collapseRender: (collapsed: any) => (
        <>
          {collapsed ? 'Mở rộng' : 'Thu gọn'}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={!collapsed ? 'collapsed' : ''}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.4712 5.52859C12.2109 5.26824 11.7888 5.26824 11.5284 5.52859L7.99984 9.05719L4.47124 5.52859C4.21089 5.26824 3.78878 5.26824 3.52843 5.52859C3.26808 5.78894 3.26808 6.21105 3.52843 6.4714L7.52843 10.4714C7.78878 10.7317 8.21089 10.7317 8.47124 10.4714L12.4712 6.4714C12.7316 6.21105 12.7316 5.78894 12.4712 5.52859Z"
              fill="#1D1E20"
            />
          </svg>
        </>
      ),
      labelWidth: 'auto',
    },

    headerTitle: (
      <>
        {search && (
          <div className="table-input-search">
            <Input
              placeholder="Tìm kiếm"
              name="keyword"
              onChange={_.debounce((e) => {
                let keyword = e.target.value;
                if (keyword === '') {
                  keyword = undefined;
                }

                setParamss({
                  ...paramss,
                  keyword,
                });
              }, 500)}
            />
          </div>
        )}
        {upload && (
          <div className="table-upload-block">
            <Space direction="vertical">
              <div className="upload-block">
                <Upload
                  beforeUpload={(file) => {
                    const isExcel =
                      file.type ===
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                    if (!isExcel) {
                      message.error(
                        intl.formatMessage({
                          id: 'pages.new_real_estate.import_request.file_type_fail',
                        }),
                        MESSAGE_DISPLAY_SECONDS.ERROR,
                      );
                    }
                    if (file.size > upload?.setting * 1024 * 1024) {
                      message.error(
                        intl.formatMessage({
                          id: 'pages.new_real_estate.import_request.fail',
                        }),
                        MESSAGE_DISPLAY_SECONDS.ERROR,
                      );
                    }
                    setImportFile(file);
                    return false;
                  }}
                  showUploadList={false}
                  maxCount={1}
                  accept={`.xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`}
                >
                  <Input
                    type="text"
                    value={importFile?.name}
                    style={{ cursor: 'pointer' }}
                    readOnly={true}
                    placeholder={intl.formatMessage({
                      id: 'pages.new_real_estate.import_request.clickable',
                    })}
                  />
                </Upload>
                <Button
                  type="primary"
                  loading={isLoadingUpload}
                  disabled={isLoadingUpload}
                  onClick={async () => {
                    setIsLoadingUpload(true);
                    const { data, keyResponse } = await realEstateService.requestImportData(
                      importFile,
                      upload?.type,
                      currentUser?.currentWorkSpace?.id,
                    );
                    if (keyResponse) {
                      handleResponseFromCallApi({ response: keyResponse });
                      setIsLoadingUpload(false);
                      return {};
                    }
                    if (data) {
                      message.success(
                        intl.formatMessage({
                          id: 'pages.new_real_estate.import_request.success',
                        }),
                        2,
                        () => {
                          setIsLoadingUpload(false);
                        },
                      );
                    }
                    setImportFile(null);
                  }}
                  // disabled={fileList.length === 0}
                  // loading={uploading}
                >
                  {'Upload'}
                </Button>
              </div>
              <a
                href={`${Settings.APP_ROOT}/template/${
                  upload?.type === 1
                    ? 'Template-Import-File-BDS-Ban.xlsx'
                    : 'Template-Import-File-BDS-Thue.xlsx'
                }`}
                className="table-upload-data__link"
                download="download"
              >
                Download template file
              </a>
              <a
                href={`${Settings.APP_ROOT}/download/masterData.zip`}
                className="table-upload-data__link"
                download="download"
              >
                Download MasterData file
              </a>
            </Space>
          </div>
        )}
      </>
    ),
  };
  const _props = {
    ..._thisProps,
    ...props,
    params: { ..._thisProps.params, ...props.params },
    search: { ..._thisProps.search, ...props.search },
  };

  return (
    <ConfigProvider renderEmpty={() => <EmptyDataTable height={150} />}>
      <ProTable columnEmptyText={false} {..._props} formRef={tableFormRef} actionRef={actionRef} />
    </ConfigProvider>
  );
});

export default BaseProTable;
