import { useState } from 'react';

export default () => {
  const [username, setUserName] = useState<string | undefined>();

  return {
    username,
    setUserName,
  };
};
