import { signalStore, withState,  patchState, withMethods } from '@ngrx/signals';
import { inject, InjectionToken } from "@angular/core";

export interface ViewSettingsState {
  view: 'table' | 'little' | 'big'
  sorted: 'asc' | 'desc' | 'random',
  paramSortBy: 'date' | 'name'
}

const initialState: ViewSettingsState = {
  view: 'big',
  sorted: 'desc',
  paramSortBy: 'date'
}

const VIEW_SETTINGS_STATE = new InjectionToken<ViewSettingsState>(
  'ViewSettingsState',
  { factory: () => initialState }
);

export const ViewSettingsStore = signalStore(
  withState(() => inject(VIEW_SETTINGS_STATE)),
  withMethods((store) => ({
    updateOrder(order: 'asc' | 'desc' | 'random'): void {
      patchState(store, () => ({ sorted: order }));
    },
    updateParamSortBy(paramSortBy: 'date' | 'name'): void {
      patchState(store, () => ({ paramSortBy: paramSortBy }));
    }
  }))
)
