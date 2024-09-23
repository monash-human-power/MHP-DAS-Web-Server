import React from 'react';
import { RouteInfo } from 'types/route';
import DashboardView from 'views/trike/DashboardView';
import ChartView from 'views/trike/ChartView';
import BoostView from 'views/common/BoostView';
import LogsView from 'views/common/LogsView';
import CameraSystemView from 'views/common/CameraSystemView';

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
  {
    name: 'Boost',
    path: '/v3/boost',
    exact: true,
    component: (BoostView as unknown) as React.Component,
  },
  {
    name: 'Camera System',
    path: '/v3/camera-system',
    exact: true,
    component: (CameraSystemView as unknown) as React.Component,
  },
  {
    name: 'Logs',
    path: '/v3/logs',
    exact: true,
    component: (LogsView as unknown) as React.Component,
  },
];

export default routes;
