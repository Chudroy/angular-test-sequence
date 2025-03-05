import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, pipe, switchMap, tap } from 'rxjs';
import { Song } from 'shared/data-access';
import { ProgressService } from 'shared/ui';
import { SongService } from 'src/app/song/data-access-song/services/song/song.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    (
      store,
      songService = inject(SongService),
      router = inject(Router),
      progressService = inject(ProgressService),
      snackBarService = inject(MatSnackBar)
    ) => ({
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
            songService.getSongDetail(songId).pipe(
              tapResponse({
                next: (song) =>
                  patchState(store, { songDetail: song, isLoading: false }),
                error: (error) => patchState(store, { isLoading: false }),
              })
            )
          )
        )
      ),
      addSong: rxMethod<Song>(
        pipe(
          tap(() => {
            progressService.openDialog();
            patchState(store, { isLoading: true });
          }),
          switchMap((song) =>
            songService.addSong(song).pipe(
              tapResponse({
                next: () => {
                  patchState(store, { isLoading: false });

                  router.navigate(['/']);

                  const message = $localize`Canción creada con éxito`;
                  const close = $localize`Cerrar`;
                  snackBarService.open(message, close, {
                    duration: 3000,
                  });
                },
                error: (error) => patchState(store, { isLoading: false }),
                finalize: () => progressService.closeDialog(),
              })
            )
          )
        )
      ),
      editSong: rxMethod<Song>(
        pipe(
          tap(() => {
            progressService.openDialog();
            patchState(store, { isLoading: true });
          }),
          switchMap((song) =>
            songService.editSong(song).pipe(
              tapResponse({
                next: () => {
                  patchState(store, { isLoading: false });

                  router.navigate(['/song', song.id]);

                  const message = $localize`Canción editada con éxito`;
                  const close = $localize`Cerrar`;
                  snackBarService.open(message, close, {
                    duration: 3000,
                  });
                },
                error: (error) => patchState(store, { isLoading: false }),
                finalize: () => progressService.closeDialog(),
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
