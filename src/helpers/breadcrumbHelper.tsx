import { Link } from 'umi';
import _ from 'lodash';
import { ReactNode } from 'react';

interface Route {
  path?: string;
  breadcrumbName: string;
  children?: Array<{
    path: string;
    breadcrumbName: string;
  }>;
}

const itemRender = function (
  route: Route,
  params: any,
  routes: Route[],
  paths: string[],
): ReactNode | undefined {
  const last = routes.indexOf(route) === routes.length - 1;
  const absolutePaths = paths.map((path) => `/${path}`);
  return last ? (
    <span>{route.breadcrumbName}</span>
  ) : (
    <Link to={_.last(absolutePaths) || route.path || '/'}>{route.breadcrumbName}</Link>
  );
};

export default itemRender;
