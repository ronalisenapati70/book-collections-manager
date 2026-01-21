import { createReducer, on } from '@ngrx/store';
import { CollectionModel } from '../models/collections.model';
import * as CollectionsActions from './collections.actions';

export interface CollectionsState {
  items: CollectionModel[];
  loading: boolean;
  error: string | null;
}

export const initialCollectionsState: CollectionsState = {
  items: [],
  loading: false,
  error: null,
};

export const collectionsReducer = createReducer(
  initialCollectionsState,
  on(CollectionsActions.loadCollections, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CollectionsActions.loadCollectionsSuccess, (state, { collections }) => ({
    ...state,
    items: collections,
    loading: false,
  })),
  on(CollectionsActions.loadCollectionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(CollectionsActions.createCollection, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CollectionsActions.createCollectionSuccess, (state, { collection }) => ({
    ...state,
    items: [...state.items, collection],
    loading: false,
  })),
  on(CollectionsActions.createCollectionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(CollectionsActions.updateCollection, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CollectionsActions.updateCollectionSuccess, (state, { collection }) => ({
    ...state,
    items: state.items.map((item) => (item.id === collection.id ? collection : item)),
    loading: false,
  })),
  on(CollectionsActions.updateCollectionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(CollectionsActions.deleteCollection, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CollectionsActions.deleteCollectionSuccess, (state, { id }) => ({
    ...state,
    items: state.items.filter((item) => item.id !== id),
    loading: false,
  })),
  on(CollectionsActions.deleteCollectionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
