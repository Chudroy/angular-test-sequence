import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'songs',
    renderMode: RenderMode.Server,
  },
  // Weird flickering issue if rendered on server
  // {
  //   path: 'songs/:songId',
  //   renderMode: RenderMode.Server,
  // },
  {
    path: 'songs/new',
    renderMode: RenderMode.Client,
  },
  {
    path: 'songs/:songId/edit',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
