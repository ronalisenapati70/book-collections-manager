import { routes } from './app.routes';

describe('app routes', () => {
  it('includes collection and book routes', () => {
    const childRoutes = routes[0]?.children ?? [];
    const paths = childRoutes.map((route) => route.path);

    expect(paths).toContain('collections');
    expect(paths).toContain('collections/new');
    expect(paths).toContain('collections/:collectionId');
    expect(paths).toContain('books');
    expect(paths).toContain('books/new');
    expect(paths).toContain('books/:bookId');
    expect(paths).toContain('collections/:collectionId/books/:bookId');
  });
});
