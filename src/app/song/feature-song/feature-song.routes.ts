import { Routes } from '@angular/router';

export const featureSongRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./containers/songs-list/songs-list.component').then(
        (m) => m.SongsListComponent
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./containers/add-song/add-song.component').then(
        (m) => m.AddSongComponent
      ),
  },
];
