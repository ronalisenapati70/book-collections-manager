import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, of } from 'rxjs';
import { Store } from '@ngrx/store';

import { BookListComponent } from './book-list.component';
import { BookModel } from '../../models/books.model';
import { CollectionModel } from '../../../collections/models/collections.model';
import { selectAllBooks } from '../../store/books.selectors';
import { selectAllCollections } from '../../../collections/store/collections.selectors';
import { BookCardComponent } from '../../components/book-card/book-card.component';

describe('BookListComponent', () => {
  let component: BookListComponent;
  let fixture: ComponentFixture<BookListComponent>;
  let store: MockStore;

  class MockStore {
    books$ = new BehaviorSubject<BookModel[]>([]);
    collections$ = new BehaviorSubject<CollectionModel[]>([]);

    select(selector: unknown) {
      if (selector === selectAllBooks) return this.books$.asObservable();
      if (selector === selectAllCollections) return this.collections$.asObservable();
      return of([]);
    }

    dispatch() {}
  }

  beforeEach(async () => {
    store = new MockStore();
    await TestBed.configureTestingModule({
      imports: [BookListComponent],
      providers: [{ provide: Store, useValue: store }],
    }).compileComponents();

    fixture = TestBed.createComponent(BookListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders book cards when data is available', () => {
    store.collections$.next([{ id: 1, name: 'Favorites', description: '', createdAt: '', theme: 'indigo' }]);
    store.books$.next([
      { id: 10, collectionId: 1, title: 'Book', author: 'A', description: 'D', rating: 4 },
    ]);
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.directive(BookCardComponent));
    expect(cards.length).toBe(1);
  });

  it('shows empty state when no books exist', () => {
    store.books$.next([]);
    fixture.detectChanges();

    const emptyTitle = fixture.debugElement.query(By.css('.empty-state-title'));
    expect(emptyTitle.nativeElement.textContent).toContain('No books');
  });

  it('opens confirm modal when remove is emitted', () => {
    const book: BookModel = {
      id: 11,
      collectionId: null,
      title: 'Test',
      author: 'A',
      description: 'D',
      rating: 3,
    };
    store.books$.next([book]);
    fixture.detectChanges();

    const card = fixture.debugElement.query(By.directive(BookCardComponent)).componentInstance as BookCardComponent;
    card.remove.emit(book);
    fixture.detectChanges();

    expect(component.bookToDelete()).toEqual(book);
  });
});
