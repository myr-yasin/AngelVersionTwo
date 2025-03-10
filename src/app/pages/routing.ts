import { Routes } from '@angular/router';

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      data: { layout: 'light-sidebar' },

  },
  {
    path: 'profile',
    loadChildren: () =>
      import('../_angel/profile/profile.module').then((m) => m.ProfileModule),
      data: { layout: 'light-sidebar' },
  },
  {
    path: 'access',
    loadChildren: () =>
      import('../_angel/access/access.module').then((m) => m.AccessModule),
      data: { layout: 'light-sidebar' },

  },
  {
    path: 'attendance',
    loadChildren: () =>
      import('../_angel/attendance/attendance.module').then((m) => m.AttendanceModule),
      data: { layout: 'light-sidebar' },

  },
  {
    path: 'builder',
    loadChildren: () =>
      import('./builder/builder.module').then((m) => m.BuilderModule),
      data: { layout: 'light-sidebar' },

  },
  {
    path:'patrol',
    loadChildren:() => 
    import('../_angel/patrol/patrol.module').then((m) => m.PatrolModule),
    data: { layout: 'light-sidebar' },
  },
  {
    path: 'crafted/account',
    loadChildren: () =>
      import('../modules/account/account.module').then((m) => m.AccountModule),
    data: { layout: 'dark-header' },
  },
  {
    path: 'crafted/pages/wizards',
    loadChildren: () =>
      import('../modules/wizards/wizards.module').then((m) => m.WizardsModule),
    data: { layout: 'light-header' },
  },
  {
    path: 'crafted/widgets',
    loadChildren: () =>
      import('../modules/widgets-examples/widgets-examples.module').then(
        (m) => m.WidgetsExamplesModule
      ),
    data: { layout: 'light-header' },
  },
  {
    path: 'apps/chat',
    loadChildren: () =>
      import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
    data: { layout: 'light-sidebar' },
  },
  {
    path: 'visitor',
    loadChildren: () =>
      import('../_angel/visitor/visitor.routes').then((m) => m.visitorRoutes),
    data: { layout: 'light-sidebar' },
  },
  {
    path: '',
    redirectTo: '/profile',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
