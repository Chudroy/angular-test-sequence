import { inject } from '@angular/core';
import { signalStore, withMethods, withState } from '@ngrx/signals';
import { Song } from 'data-access-song';
import { SongService } from 'src/app/song/data-access-song/services/song/song.service';
import { patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
interface SongState {
  songs: Song[];
  isLoading: boolean;
}

const initialState: SongState = {
  songs: [],
  isLoading: false,
};

export const SongsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, songService = inject(SongService)) => ({
    getSongs: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          songService.getSongs().pipe(
            tapResponse({
              next: (songs) => patchState(store, { songs, isLoading: false }),
              error: (error) => patchState(store, { isLoading: false }),
            })
          )
        )
      )
    ),
  }))
);
