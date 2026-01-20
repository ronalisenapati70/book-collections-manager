import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/app-layout/app-layout.component').then((m) => m.AppLayoutComponent),
    children: [
      // Collections
      {
        path: 'collections',
        loadComponent: () =>
          import('./features/collections/pages/collection-list/collection-list.component').then(
            (m) => m.CollectionListComponent,
          ),
      },
      {
        path: 'collections/new',
        loadComponent: () =>
          import('./features/collections/pages/collection-new/collection-new.component').then(
            (m) => m.CollectionNewComponent,
          ),
      },
      {
        path: 'collections/:collectionId',
        loadComponent: () =>
          import('./features/collections/pages/collection-detail/collection-detail.component').then(
            (m) => m.CollectionDetailComponent,
          ),
      },
      // Books
      {
        path: 'books',
        loadComponent: () =>
          import('./features/books/pages/book-list/book-list.component').then(
            (m) => m.BookListComponent,
          ),
      },
      {
        path: 'books/new',
        loadComponent: () =>
          import('./features/books/pages/book-new/book-new.component').then(
            (m) => m.BookNewComponent,
          ),
      },
      {
        path: 'books/:bookId',
        loadComponent: () =>
          import('./features/books/pages/book-detail/book-detail.component').then(
            (m) => m.BookDetailComponent,
          ),
      },

      // Depth Route
      {
        path: 'collections/:collectionId/books/:bookId',
        loadComponent: () =>
          import('./features/books/pages/book-detail/book-detail.component').then(
            (m) => m.BookDetailComponent,
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'collections',
      },
      {
        path: '**',
        redirectTo: 'collections',
      },
    ],
  },
];
