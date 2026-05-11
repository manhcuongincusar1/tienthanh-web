import ProForm, { ProFormItemProps } from '@ant-design/pro-form';
import { AutoComplete, AutoCompleteProps, Input } from 'antd';
import { useEffect, useState } from 'react';

const { Option } = AutoComplete;

interface Options {
  value: string;
  label?: string;
  id?: string;
  full_name?: string;
}

interface ProFormAutocompleteProps extends ProFormItemProps {
  fieldProps?: AutoCompleteProps & { options: Options[] | undefined };
  suffix?: React.ReactNode;
}

export default function ProFormAutocomplete({
  fieldProps,
  ...restProps
}: ProFormAutocompleteProps) {
  return (
    <ProForm.Item {...restProps}>
      <AutoComplete {...fieldProps}>
        <Input
          placeholder={restProps.placeholder ? `${restProps.placeholder}` : 'Nhập dữ liệu'}
          allowClear
          suffix={restProps.suffix}
          disabled={restProps?.disabled}
        />
      </AutoComplete>
    </ProForm.Item>
  );
}
