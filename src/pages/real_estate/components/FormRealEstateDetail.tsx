import { ProFormSelect, ProFormSwitch, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Col } from 'antd';
import { useIntl, useModel } from 'umi';
import { REAL_LOCATION_ENUM, DIRECTION_ENUM, REAL_ESTATE_TYPE_ENUM } from '../constants';
import {
  CHECK_VALUE_STRING,
  CHECK_MEASURE_DECIMAL_NUMBER,
  CHECK_INTEGER_NUMBER,
} from '@/pages/expression';

export default function FormRealEstateSellDetail() {
  const intl = useIntl();
  const { typePage } = useModel('realEstateSell');

  return (
    <>
      <Col span={24} lg={{ span: 8 }} xl={{ span: 6 }}>
        <ProFormSelect
          name="direction"
          placeholder={intl.formatMessage({ id: 'pages.real_estate_sale.enter_direction' })}
          valueEnum={DIRECTION_ENUM}
          rules={[
            {
              pattern: CHECK_VALUE_STRING,
              message: intl.formatMessage({ id: 'form.phone_not_number' }),
            },
          ]}
          label={intl.formatMessage({ id: 'pages.real_estate_sale.direction' })}
        />
      </Col>
      <Col span={12} lg={{ span: 8 }} xl={{ span: 3 }}>
        <ProFormText
          name="horizontal"
          fieldProps={{
            className: 'field_number_real_estate_sale input-height-40',
            allowClear: false,
            style: {
              textAlign: 'left',
            },
          }}
          rules={[
            { required: true, message: intl.formatMessage({ id: 'form.enter_info' }) },
            {
              pattern: CHECK_MEASURE_DECIMAL_NUMBER,
              message: intl.formatMessage({ id: 'form.field.number_incorrect' }),
            },
          ]}
          placeholder="0"
          label={intl.formatMessage({ id: 'pages.real_estate_sale.horizontal' })}
        />
      </Col>
      <Col span={12} lg={{ span: 8 }} xl={{ span: 3 }}>
        <ProFormText
          name="long"
          placeholder="0"
          fieldProps={{
            className: 'field_number_real_estate_sale input-height-40',
            allowClear: false,
          }}
          rules={[
            { required: true, message: intl.formatMessage({ id: 'form.enter_info' }) },
            {
              pattern: CHECK_MEASURE_DECIMAL_NUMBER,
              message: intl.formatMessage({ id: 'form.field.number_incorrect' }),
            },
          ]}
          label={intl.formatMessage({ id: 'pages.real_estate_sale.long' })}
        />
      </Col>
      <Col span={12} lg={{ span: 8 }} xl={{ span: 6 }}>
        <ProFormText
          name="area"
          placeholder="0"
          fieldProps={{
            className: 'field_number_real_estate_sale input-height-40',
            allowClear: false,
          }}
          rules={[
            {
              pattern: CHECK_MEASURE_DECIMAL_NUMBER,
              message: intl.formatMessage({ id: 'form.field.number_incorrect' }),
            },
          ]}
          label={intl.formatMessage(
            {
              id: 'pages.real_estate_sale.area_label',
            },
            {
              unit: (
                <span>
                  m<sup>2</sup>
                </span>
              ),
            },
          )}
        />
      </Col>
      <Col span={12} lg={{ span: 8 }} xl={{ span: 6 }}>
        <ProFormText
          name="recognized_area"
          placeholder="0"
          fieldProps={{
            className: 'field_number_real_estate_sale input-height-40',
            allowClear: false,
          }}
          label={intl.formatMessage(
            {
              id: 'pages.real_estate_sale.recognized_area',
            },
            {
              unit: (
                <span>
                  m<sup>2</sup>
                </span>
              ),
            },
          )}
          rules={[
            {
              required: typePage?.type === REAL_ESTATE_TYPE_ENUM.SELL,
              message: intl.formatMessage({ id: 'form.enter_info' }),
            },
            {
              pattern: CHECK_MEASURE_DECIMAL_NUMBER,
              message: intl.formatMessage({ id: 'form.field.number_incorrect' }),
            },
          ]}
        />
      </Col>
      <Col span={12} lg={{ span: 8 }} xl={{ span: 6 }}>
        <ProFormText
          name="bedroom"
          placeholder="0"
          fieldProps={{
            className: 'field_number_real_estate_sale input-height-40',
            allowClear: false,
          }}
          rules={[
            {
              pattern: CHECK_INTEGER_NUMBER,
              message: intl.formatMessage({ id: 'form.field.number_incorrect' }),
            },
          ]}
          label={intl.formatMessage({ id: 'pages.real_estate_sale.bedroom' })}
        />
      </Col>
      <Col span={12} lg={{ span: 8 }} xl={{ span: 6 }}>
        <ProFormText
          name="wc"
          fieldProps={{
            className: 'field_number_real_estate_sale input-height-40',
            allowClear: false,
          }}
          rules={[
            {
              pattern: CHECK_INTEGER_NUMBER,
              message: intl.formatMessage({ id: 'form.field.number_incorrect' }),
            },
          ]}
          placeholder="0"
          label={intl.formatMessage({ id: 'pages.real_estate_sale.wc' })}
        />
      </Col>
      <Col span={12} lg={{ span: 8 }} xl={{ span: 6 }}>
        <ProFormSelect
          name="location"
          placeholder={intl.formatMessage({
            id: 'form.select',
          })}
          valueEnum={REAL_LOCATION_ENUM}
          rules={[{ required: true, message: intl.formatMessage({ id: 'form.enter_info' }) }]}
          label={intl.formatMessage({ id: 'pages.real_estate_sale.location' })}
        />
      </Col>
      <Col span={12} lg={{ span: 8 }} xl={{ span: 6 }}>
        <ProFormSwitch
          name="book_status"
          label={intl.formatMessage({ id: 'pages.real_estate_sale.book_status' })}
          fieldProps={{
            defaultChecked: true,
          }}
        />
      </Col>
      <Col span={24} lg={{ span: 12 }}>
        <ProFormTextArea
          name="structure"
          placeholder={intl.formatMessage({
            id: 'form.enter_area',
          })}
          rules={[
            { required: true, message: intl.formatMessage({ id: 'form.enter_info' }) },
            { max: 1000, message: intl.formatMessage({ id: 'form.over_length' }) },
          ]}
          label={intl.formatMessage({ id: 'pages.real_estate_sale.structure' })}
        />
      </Col>
      <Col span={24} lg={{ span: 12 }}>
        <ProFormTextArea
          name="note"
          placeholder={intl.formatMessage({
            id: 'form.enter_area',
          })}
          rules={[{ max: 1000, message: intl.formatMessage({ id: 'form.over_length' }) }]}
          label={intl.formatMessage({ id: 'pages.real_estate_sale.note' })}
        />
      </Col>
    </>
  );
}
