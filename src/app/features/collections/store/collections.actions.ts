import { createAction, props } from '@ngrx/store';
import { CollectionModel } from '../models/collections.model';
import { NewCollectionModel } from '../../../core/api/library-api.service';

export const loadCollections = createAction('[Collections] Load Collections');
export const loadCollectionsSuccess = createAction(
  '[Collections] Load Collections Success',
  props<{ collections: CollectionModel[] }>(),
);
export const loadCollectionsFailure = createAction(
  '[Collections] Load Collections Failure',
  props<{ error: string }>(),
);

export const createCollection = createAction(
  '[Collections] Create Collection',
  props<{ collection: NewCollectionModel }>(),
);
export const createCollectionSuccess = createAction(
  '[Collections] Create Collection Success',
  props<{ collection: CollectionModel }>(),
);
export const createCollectionFailure = createAction(
  '[Collections] Create Collection Failure',
  props<{ error: string }>(),
);

export const updateCollection = createAction(
  '[Collections] Update Collection',
  props<{ collection: CollectionModel }>(),
);
export const updateCollectionSuccess = createAction(
  '[Collections] Update Collection Success',
  props<{ collection: CollectionModel }>(),
);
export const updateCollectionFailure = createAction(
  '[Collections] Update Collection Failure',
  props<{ error: string }>(),
);

export const deleteCollection = createAction(
  '[Collections] Delete Collection',
  props<{ id: number }>(),
);
export const deleteCollectionSuccess = createAction(
  '[Collections] Delete Collection Success',
  props<{ id: number }>(),
);
export const deleteCollectionFailure = createAction(
  '[Collections] Delete Collection Failure',
  props<{ error: string }>(),
);
