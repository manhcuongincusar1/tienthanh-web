export default () => {
  const getWorkspaceId = (initialState: any) => {
    const currentUser = initialState?.currentUser;
    if (currentUser) {
      const workspace_id = currentUser?.currentWorkSpace?.id;
      return workspace_id;
    }
  };
  return { getWorkspaceId };
};
