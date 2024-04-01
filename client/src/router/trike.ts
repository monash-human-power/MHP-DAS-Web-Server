import React from 'react';
import { RouteInfo } from 'types/route';
import DashboardView from 'views/trike/DashboardView';
import ChartView from 'views/trike/ChartView';

const routes: RouteInfo[] = [
  {
    name: 'Dashboard',
    path: '/trike/',
    exact: true,
    component: (DashboardView as unknown) as React.Component,
  },
  {
    name: 'Charts',
    path: '/trike/charts',
    exact: true,
    component: (ChartView as unknown) as React.Component,
  },
];

export default routes;
