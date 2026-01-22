import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';

import { BookDetailComponent } from './book-detail.component';
import { BookModel } from '../../models/books.model';
import { CollectionModel } from '../../../collections/models/collections.model';
import { selectAllBooks, selectBooksLoading } from '../../store/books.selectors';
import { selectAllCollections } from '../../../collections/store/collections.selectors';
import { BookFormComponent } from '../../components/book-form/book-form.component';

describe('BookDetailComponent', () => {
  let component: BookDetailComponent;
  let fixture: ComponentFixture<BookDetailComponent>;
  let store: MockStore;

  class MockStore {
    books$ = new BehaviorSubject<BookModel[]>([]);
    collections$ = new BehaviorSubject<CollectionModel[]>([]);
    loading$ = new BehaviorSubject<boolean>(false);

    select(selector: unknown) {
      if (selector === selectAllBooks) return this.books$.asObservable();
      if (selector === selectAllCollections) return this.collections$.asObservable();
      if (selector === selectBooksLoading) return this.loading$.asObservable();
      return of([]);
    }

    dispatch() {}
  }

  beforeEach(async () => {
    store = new MockStore();
    await TestBed.configureTestingModule({
      imports: [BookDetailComponent],
      providers: [
        { provide: Store, useValue: store },
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ bookId: '1' })),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders edit header and form when book exists', () => {
    store.collections$.next([
      { id: 1, name: 'Favorites', description: '', createdAt: '', theme: 'indigo' },
    ]);
    store.books$.next([
      { id: 1, collectionId: 1, title: 'Book', author: 'A', description: 'D', rating: 4 },
    ]);
    fixture.detectChanges();

    const header = fixture.debugElement.query(By.css('.page-header h1'));
    expect(header.nativeElement.textContent).toContain('Edit Book');

    const form = fixture.debugElement.query(By.directive(BookFormComponent));
    expect(form).toBeTruthy();
  });

  it('shows not found when book is missing and loading is false', () => {
    store.books$.next([]);
    store.loading$.next(false);
    fixture.detectChanges();

    const notFound = fixture.debugElement.query(By.css('.not-found'));
    expect(notFound.nativeElement.textContent).toContain('Book not found');
  });
});
