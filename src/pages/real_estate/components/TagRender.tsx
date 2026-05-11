import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { Tag } from 'antd';
import { useModel } from 'umi';

export const TagRender = (props: CustomTagProps) => {
  const { label, value, closable, onClose } = props;
  const { realEstateStatus } = useModel('realEstateSell');

  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      color={realEstateStatus && realEstateStatus?.find((item) => item.value === value)?.color}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
};
