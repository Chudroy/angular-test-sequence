import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, pipe, switchMap, tap } from 'rxjs';
import { Song } from 'shared/data-access';
import { SongService } from 'src/app/song/data-access-song/services/song/song.service';

interface SongState {
  songDetail: Song | null;
  songs: Song[];
  isLoading: boolean;
}

const initialState: SongState = {
  songDetail: null,
  songs: [],
  isLoading: false,
};

export const SongsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (store, songService = inject(SongService), router = inject(Router)) => ({
      getSongs: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() =>
            songService.getSongs().pipe(
              tapResponse({
                next: (songs) => {
                  patchState(store, { songs, isLoading: false });
                },
                error: (error) => patchState(store, { isLoading: false }),
              })
            )
          )
        )
      ),
      getSongDetail: rxMethod<string | undefined>(
        pipe(
          filter((songId): songId is string => !!songId),
          tap(() => patchState(store, { isLoading: true })),
          switchMap((songId) =>
            songService.getSong(songId).pipe(
              tapResponse({
                next: (song) =>
                  patchState(store, { songDetail: song, isLoading: false }),
                error: (error) => patchState(store, { isLoading: false }),
              })
            )
          )
        )
      ),
      deleteSong: rxMethod<string | undefined>(
        pipe(
          filter((songId): songId is string => !!songId),
          tap(() => patchState(store, { isLoading: true })),
          switchMap((songId) =>
            songService.deleteSong(songId).pipe(
              tapResponse({
                next: () => {
                  router.navigate(['/']);
                },
                error: (error) => patchState(store, { isLoading: false }),
              })
            )
          )
        )
      ),
    })
  )
);
