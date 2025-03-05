import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

interface SidenavState {
  isOpenSidenav: boolean;
}

const initialState: SidenavState = {
  isOpenSidenav: false,
};

export const SidenavStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    toggleSidenav: () =>
      patchState(store, { isOpenSidenav: !store.isOpenSidenav() }),
  }))
);
