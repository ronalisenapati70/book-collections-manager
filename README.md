# BookCollectionsManager

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.5.

## Prerequisites

- Node.js 18+ and npm

## Install

```bash
npm install
```

## Run locally

```bash
npm start
```

Then open `http://localhost:4200/`.

## Features

- Manage collections and books (create, edit, delete)
- Filter collections and books
- In-memory API for simulated backend
- Typed reactive forms
- NgRx store + effects for collections and books

## Architecture overview

- Standalone components with typed reactive forms are used throughout
- NgRx is used for state management of collections and books
- `LibraryApiService` talks to the in-memory API at `/api`
- Forms live in feature components; shared UI lives under `src/app/shared`
- angular-in-memory-web-api simulates a backend (`/api/collections`, `/api/books`)

## Routing

- `/collections` list collections
- `/collections/new` create collection
- `/collections/:collectionId` collection detail + edit
- `/books` list books
- `/books/new` create book
- `/books/:bookId` book detail + edit
- `/collections/:collectionId/books/:bookId` book detail within a collection

## Notes

- Empty path and unknown routes redirect to `/collections`
- All routes are nested under the `AppLayoutComponent`
- Data is persisted only in memory; page reload resets state
- NgRx store is the source of truth during runtime

## Tests

Run the basic component and route tests with:

```bash
npm test
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
