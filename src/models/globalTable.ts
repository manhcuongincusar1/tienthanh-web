import { useState } from 'react';

export default () => {
  const [visibleSpin, setVisibleSpin] = useState();
  const [forceUpdateGridLayout, setForceUpdateGridLayout] = useState<number>(0);
  const [tableClear, setTableClear] = useState<boolean>(false);
  return {
    visibleSpin,
    onChangeVisibleSpin: setVisibleSpin,
    forceUpdateGridLayout,
    setForceUpdateGridLayout,
    tableClear, setTableClear
  };
};
