import { Routes } from '@angular/router';
import { LayoutComponent } from 'feature-layout';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'feature-song',
        loadChildren: () =>
          import('feature-song').then((m) => m.featureSongRoutes),
      },
      {
        path: '**',
        redirectTo: 'feature-song',
      },
    ],
  },
];
