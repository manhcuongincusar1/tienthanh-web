import { Button, ButtonProps } from 'antd';
import { useIntl } from 'umi';

export default function ButtonAddNew(props: ButtonProps) {
  const intl = useIntl();
  return (
    <Button type="primary" {...props} shape="circle" key="primary" size="small">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.99984 2.66667C8.36803 2.66667 8.6665 2.96514 8.6665 3.33333V7.33333H12.6665C13.0347 7.33333 13.3332 7.63181 13.3332 8C13.3332 8.36819 13.0347 8.66667 12.6665 8.66667H8.6665V12.6667C8.6665 13.0349 8.36803 13.3333 7.99984 13.3333C7.63165 13.3333 7.33317 13.0349 7.33317 12.6667V8.66667H3.33317C2.96498 8.66667 2.6665 8.36819 2.6665 8C2.6665 7.63181 2.96498 7.33333 3.33317 7.33333H7.33317V3.33333C7.33317 2.96514 7.63165 2.66667 7.99984 2.66667Z"
          fill="white"
        />
      </svg>
      {intl.formatMessage({ id: 'global.create_new' })}
    </Button>
  );
}
