import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { routes } from './app.routes';
import { InMemoryDataService } from './core/in-memory-data/in-memory-data.service';
import { collectionsReducer } from './features/collections/store/collections.reducer';
import { CollectionsEffects } from './features/collections/store/collections.effects';
import { booksReducer } from './features/books/store/books.reducer';
import { BooksEffects } from './features/books/store/books.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // HttpClient (required for API calls)
    provideHttpClient(withInterceptorsFromDi()),

    // NgRx store + effects
    provideStore({ collections: collectionsReducer, books: booksReducer }),
    provideEffects(CollectionsEffects, BooksEffects),

    // In-memory backend (dev-only fake server)
    importProvidersFrom(
      HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
        apiBase: 'api/',
        dataEncapsulation: false,
        delay: 300,
      }),
    ),
  ],
};
