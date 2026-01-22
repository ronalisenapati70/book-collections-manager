import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { CollectionDetailComponent } from './collection-detail.component';
import { CollectionModel } from '../../models/collections.model';
import { BookModel } from '../../../books/models/books.model';
import { selectAllCollections } from '../../store/collections.selectors';
import { selectAllBooks } from '../../../books/store/books.selectors';
import { BookCardComponent } from '../../../books/components/book-card/book-card.component';

describe('CollectionDetailComponent', () => {
  let component: CollectionDetailComponent;
  let fixture: ComponentFixture<CollectionDetailComponent>;
  let store: MockStore;

  class MockStore {
    collections$ = new BehaviorSubject<CollectionModel[]>([]);
    books$ = new BehaviorSubject<BookModel[]>([]);

    select(selector: unknown) {
      if (selector === selectAllCollections) return this.collections$.asObservable();
      if (selector === selectAllBooks) return this.books$.asObservable();
      return of([]);
    }

    dispatch() {}
  }

  beforeEach(async () => {
    store = new MockStore();
    await TestBed.configureTestingModule({
      imports: [CollectionDetailComponent],
      providers: [
        { provide: Store, useValue: store },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ collectionId: '1' })),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders collection header and book cards', () => {
    store.collections$.next([
      {
        id: 1,
        name: 'Favorites',
        description: 'Top picks',
        createdAt: '2025-01-01',
        theme: 'indigo',
      },
    ]);
    store.books$.next([
      { id: 10, collectionId: 1, title: 'Book', author: 'A', description: 'D', rating: 4 },
    ]);

    fixture.detectChanges();

    const header = fixture.debugElement.query(By.css('.header-main h1'));
    expect(header.nativeElement.textContent).toContain('Favorites');

    const cards = fixture.debugElement.queryAll(By.directive(BookCardComponent));
    expect(cards.length).toBe(1);
  });

  it('shows empty state when no books in collection', () => {
    store.collections$.next([
      {
        id: 1,
        name: 'Favorites',
        description: 'Top picks',
        createdAt: '2025-01-01',
        theme: 'indigo',
      },
    ]);
    store.books$.next([]);
    fixture.detectChanges();

    const emptyState = fixture.debugElement.query(By.css('.empty-state'));
    expect(emptyState.nativeElement.textContent).toContain('No books found');
  });

  it('opens confirm modal when remove is emitted', () => {
    const book: BookModel = {
      id: 12,
      collectionId: 1,
      title: 'Book',
      author: 'A',
      description: 'D',
      rating: 4,
    };
    store.collections$.next([
      {
        id: 1,
        name: 'Favorites',
        description: 'Top picks',
        createdAt: '2025-01-01',
        theme: 'indigo',
      },
    ]);
    store.books$.next([book]);
    fixture.detectChanges();

    const card = fixture.debugElement.query(By.directive(BookCardComponent)).componentInstance as BookCardComponent;
    card.remove.emit(book);
    fixture.detectChanges();

    expect(component.bookToDelete()).toEqual(book);
  });
});
