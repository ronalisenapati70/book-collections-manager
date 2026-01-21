import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CollectionsState } from './collections.reducer';

export const selectCollectionsState = createFeatureSelector<CollectionsState>('collections');

export const selectAllCollections = createSelector(
  selectCollectionsState,
  (state) => state.items,
);

export const selectCollectionsLoading = createSelector(
  selectCollectionsState,
  (state) => state.loading,
);

export const selectCollectionsError = createSelector(
  selectCollectionsState,
  (state) => state.error,
);
