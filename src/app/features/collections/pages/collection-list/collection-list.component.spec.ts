import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { provideRouter } from '@angular/router';

import { CollectionListComponent } from './collection-list.component';
import { CollectionModel } from '../../models/collections.model';
import { BookModel } from '../../../books/models/books.model';
import { selectAllCollections } from '../../store/collections.selectors';
import { selectAllBooks } from '../../../books/store/books.selectors';

describe('CollectionListComponent', () => {
  let component: CollectionListComponent;
  let fixture: ComponentFixture<CollectionListComponent>;
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
      imports: [CollectionListComponent],
      providers: [{ provide: Store, useValue: store }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders collection cards with book counts', () => {
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

    const cards = fixture.debugElement.queryAll(By.css('.collection-card'));
    expect(cards.length).toBe(1);
    const count = fixture.debugElement.query(By.css('.book-count'));
    expect(count.nativeElement.textContent).toContain('1');
  });

  it('shows empty state when no collections exist', () => {
    store.collections$.next([]);
    store.books$.next([]);

    fixture.detectChanges();

    const emptyTitle = fixture.debugElement.query(By.css('.empty-state-title'));
    expect(emptyTitle.nativeElement.textContent).toContain('No collections');
  });

  it('opens confirm modal when delete is clicked', () => {
    const collection: CollectionModel = {
      id: 2,
      name: 'Read Later',
      description: 'Backlog',
      createdAt: '2025-02-01',
      theme: 'emerald',
    };
    store.collections$.next([collection]);
    store.books$.next([]);
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(By.css('.delete-button'));
    deleteButton.triggerEventHandler('click', new Event('click'));
    fixture.detectChanges();

    expect(component.itemToDelete()).toEqual(collection);
  });
});
