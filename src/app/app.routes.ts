import { Routes } from '@angular/router';
import { LayoutComponent } from 'feature-layout';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'songs',
        loadChildren: () =>
          import('src/app/song/feature-song/feature-song.routes').then((m) => m.featureSongRoutes),
      },
      {
        path: '**',
        redirectTo: 'songs',
      },
    ],
  },
];
