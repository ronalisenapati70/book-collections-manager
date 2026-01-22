import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';

import { LibraryApiService } from '../../../core/api/library-api.service';
import * as CollectionsActions from './collections.actions';
import { selectAllBooks } from '../../books/store/books.selectors';
import { updateBook } from '../../books/store/books.actions';

@Injectable()
export class CollectionsEffects {
  private actions$ = inject(Actions);
  private api = inject(LibraryApiService);
  private store = inject(Store);

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
      withLatestFrom(this.store.select(selectAllBooks)),
      switchMap(([{ collection, selectedBookIds }, books]) =>
        this.api.createCollection(collection).pipe(
          mergeMap((created) => {
            const updates = (selectedBookIds ?? [])
              .map((id) => books.find((item) => item.id === id))
              .filter((item): item is NonNullable<typeof item> => !!item)
              .map((book) =>
                updateBook({ book: { ...book, collectionId: created.id } }),
              );

            return [
              CollectionsActions.createCollectionSuccess({ collection: created }),
              ...updates,
            ];
          }),
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
