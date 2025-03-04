import { Routes } from '@angular/router';

export const featureSongRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./containers/songs-list/songs-list.component').then(
        (m) => m.SongsListComponent
      ),
  },
];
