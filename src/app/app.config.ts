import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { routes } from './app.routes';
import { InMemoryDataService } from './core/in-memory-data/in-memory-data.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // HttpClient (required for API calls)
    provideHttpClient(withInterceptorsFromDi()),

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
