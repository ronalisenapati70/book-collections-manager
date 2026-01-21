import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { LibraryApiService } from '../../../core/api/library-api.service';
import * as BooksActions from './books.actions';

@Injectable()
export class BooksEffects {
  private actions$ = inject(Actions);
  private api = inject(LibraryApiService);

  loadBooks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BooksActions.loadBooks),
      switchMap(() =>
        this.api.getBooks().pipe(
          map((books) => BooksActions.loadBooksSuccess({ books })),
          catchError((error) =>
            of(
              BooksActions.loadBooksFailure({
                error: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  createBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BooksActions.createBook),
      switchMap(({ book }) =>
        this.api.createBook(book).pipe(
          map((created) => BooksActions.createBookSuccess({ book: created })),
          catchError((error) =>
            of(
              BooksActions.createBookFailure({
                error: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  updateBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BooksActions.updateBook),
      switchMap(({ book }) =>
        this.api.updateBook(book).pipe(
          map((updated) =>
            BooksActions.updateBookSuccess({
              book: updated && updated.id ? updated : book,
            }),
          ),
          catchError((error) =>
            of(
              BooksActions.updateBookFailure({
                error: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  deleteBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BooksActions.deleteBook),
      switchMap(({ id }) =>
        this.api.deleteBook(id).pipe(
          map(() => BooksActions.deleteBookSuccess({ id })),
          catchError((error) =>
            of(
              BooksActions.deleteBookFailure({
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
