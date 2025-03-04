import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

interface HeaderState {
  title: string | null;
}

const initialState: HeaderState = {
  title: null,
};

export const HeaderStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setTitle: (title: string) => patchState(store, { title }),
  }))
);
