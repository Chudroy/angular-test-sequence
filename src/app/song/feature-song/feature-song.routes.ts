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
    path: ':songId',
    loadComponent: () =>
      import('./containers/song-detail/song-detail.component').then(
        (m) => m.SongDetailComponent
      ),
  },
  {
    path: ':songId/edit',
    loadComponent: () =>
      import('./containers/edit-song/edit-song.component').then(
        (m) => m.EditSongComponent
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
