import { createAction, props } from '@ngrx/store';
import { BookModel } from '../models/books.model';
import { NewBookModel } from '../../../core/api/library-api.service';

export const loadBooks = createAction('[Books] Load Books');
export const loadBooksSuccess = createAction(
  '[Books] Load Books Success',
  props<{ books: BookModel[] }>(),
);
export const loadBooksFailure = createAction(
  '[Books] Load Books Failure',
  props<{ error: string }>(),
);

export const createBook = createAction(
  '[Books] Create Book',
  props<{ book: NewBookModel }>(),
);
export const createBookSuccess = createAction(
  '[Books] Create Book Success',
  props<{ book: BookModel }>(),
);
export const createBookFailure = createAction(
  '[Books] Create Book Failure',
  props<{ error: string }>(),
);

export const updateBook = createAction('[Books] Update Book', props<{ book: BookModel }>());
export const updateBookSuccess = createAction(
  '[Books] Update Book Success',
  props<{ book: BookModel }>(),
);
export const updateBookFailure = createAction(
  '[Books] Update Book Failure',
  props<{ error: string }>(),
);

export const deleteBook = createAction('[Books] Delete Book', props<{ id: number }>());
export const deleteBookSuccess = createAction(
  '[Books] Delete Book Success',
  props<{ id: number }>(),
);
export const deleteBookFailure = createAction(
  '[Books] Delete Book Failure',
  props<{ error: string }>(),
);
