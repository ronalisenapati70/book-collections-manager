import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { LibraryApiService } from '../../../core/api/library-api.service';
import * as CollectionsActions from './collections.actions';

@Injectable()
export class CollectionsEffects {
  private actions$ = inject(Actions);
  private api = inject(LibraryApiService);

  loadCollections$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.loadCollections),
      switchMap(() =>
        this.api.getCollections().pipe(
          map((collections) =>
            CollectionsActions.loadCollectionsSuccess({ collections }),
          ),
          catchError((error) =>
            of(
              CollectionsActions.loadCollectionsFailure({
                error: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  createCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.createCollection),
      switchMap(({ collection }) =>
        this.api.createCollection(collection).pipe(
          map((created) =>
            CollectionsActions.createCollectionSuccess({ collection: created }),
          ),
          catchError((error) =>
            of(
              CollectionsActions.createCollectionFailure({
                error: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  updateCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.updateCollection),
      switchMap(({ collection }) =>
        this.api.updateCollection(collection).pipe(
          map((updated) =>
            CollectionsActions.updateCollectionSuccess({
              collection: updated && updated.id ? updated : collection,
            }),
          ),
          catchError((error) =>
            of(
              CollectionsActions.updateCollectionFailure({
                error: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  deleteCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.deleteCollection),
      switchMap(({ id }) =>
        this.api.deleteCollection(id).pipe(
          map(() => CollectionsActions.deleteCollectionSuccess({ id })),
          catchError((error) =>
            of(
              CollectionsActions.deleteCollectionFailure({
                error: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  private getErrorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'message' in error) {
      return String((error as { message: unknown }).message);
    }

    return 'Unknown error';
  }
}
