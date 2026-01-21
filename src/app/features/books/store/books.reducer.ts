import { createReducer, on } from '@ngrx/store';
import { BookModel } from '../models/books.model';
import * as BooksActions from './books.actions';

export interface BooksState {
  items: BookModel[];
  loading: boolean;
  error: string | null;
}

export const initialBooksState: BooksState = {
  items: [],
  loading: false,
  error: null,
};

export const booksReducer = createReducer(
  initialBooksState,
  on(BooksActions.loadBooks, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(BooksActions.loadBooksSuccess, (state, { books }) => ({
    ...state,
    items: books,
    loading: false,
  })),
  on(BooksActions.loadBooksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(BooksActions.createBook, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(BooksActions.createBookSuccess, (state, { book }) => ({
    ...state,
    items: [...state.items, book],
    loading: false,
  })),
  on(BooksActions.createBookFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(BooksActions.updateBook, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(BooksActions.updateBookSuccess, (state, { book }) => ({
    ...state,
    items: state.items.map((item) => (item.id === book.id ? book : item)),
    loading: false,
  })),
  on(BooksActions.updateBookFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(BooksActions.deleteBook, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(BooksActions.deleteBookSuccess, (state, { id }) => ({
    ...state,
    items: state.items.filter((item) => item.id !== id),
    loading: false,
  })),
  on(BooksActions.deleteBookFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
