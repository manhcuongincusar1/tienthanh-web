import { useEffect, useState } from 'react';
import { TOKEN } from '@/constants';
import fetchUserInfo from '@/helpers/fetchUserInfo';
import { useModel } from 'umi';

export default function HandleLocalStorageChange() {
  const { refresh, setInitialState, initialState } = useModel('@@initialState');
  const [tokenNew, setTokenNew] = useState<string | null>();
  const [tokenPrevious, setTokenPrevious] = useState<string | null>();

  useEffect(() => {
    const handleOnChangeStorage = async () => {
      const newTokenChange = localStorage.getItem(TOKEN);
      setTokenNew(newTokenChange);
    };
    window.addEventListener('storage', handleOnChangeStorage);
    return () => {
      window.removeEventListener('storage', handleOnChangeStorage);
    };
  }, []);

  useEffect(() => {
    if (tokenPrevious === null) {
      refresh();
    } else if (tokenPrevious !== tokenNew) {
      fetchUserInfo().then((response) => {
        const { currentUser, listWorkspace }: any = response || {};
        if (currentUser?.id !== initialState?.currentUser?.id) {
          setInitialState((preInitialState: any) => ({
            ...preInitialState,
            fetchUserInfo,
            listWorkspace: listWorkspace,
            currentUser,
            show404: false,
            show403: currentUser?.permission_data ? false : true,
          }));
        }
      });
      setTokenPrevious(tokenNew);
    }
  }, [tokenNew]);

  return <></>;
}
