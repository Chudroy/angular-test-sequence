import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { Song } from '../models';
import { Artist } from '../models/artist.models';
import { Company } from '../models/company.models';
import { PopulateService } from '../services/populate.service';

interface PopulateState {
  songs: Song[];
  artists: Artist[];
  companies: Company[];
  isLoading: boolean;
}

const initialState: PopulateState = {
  songs: [],
  artists: [],
  companies: [],
  isLoading: false,
};

export const PopulateStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    artistIdMap: computed(() => {
      const artists = store.artists();
      if (!artists) return [];
      const map = artists.map((artist) => {
        return {
          id: artist.id,
          name: artist.name,
        };
      });

      return map;
    }),
    companiesIdMap: computed(() => {
      const companies = store.companies();
      if (!companies) return [];
      const map = companies.map((c) => {
        return {
          id: c.id,
          name: c.name,
        };
      });

      return map;
    }),
  })),
  withMethods((store, populateSerive = inject(PopulateService)) => ({
    fetchData: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          populateSerive.fetchData().pipe(
            tapResponse({
              next: (response) =>
                patchState(store, {
                  songs: response.songs,
                  artists: response.artists,
                  companies: response.companies,
                  isLoading: false,
                }),
              error: (error) =>
                patchState(store, {
                  songs: [],
                  artists: [],
                  companies: [],
                  isLoading: false,
                }),
            })
          )
        )
      )
    ),
  }))
);
