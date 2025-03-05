import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

interface HeaderState {
  title: string | null;
  goBack: boolean;
}

const initialState: HeaderState = {
  title: null,
  goBack: false,
};

export const HeaderStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setHeader: ({
      title,
      goBack = false,
    }: {
      title: string;
      goBack?: boolean;
    }) => patchState(store, { title, goBack }),
  }))
);
