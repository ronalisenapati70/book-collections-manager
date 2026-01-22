import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, of } from 'rxjs';
import { Store } from '@ngrx/store';

import { CollectionNewComponent } from './collection-new.component';
import { BookModel } from '../../../books/models/books.model';
import { selectAllBooks } from '../../../books/store/books.selectors';
import { CollectionFormComponent } from '../../components/collection-form/collection-form.component';

describe('CollectionNewComponent', () => {
  let component: CollectionNewComponent;
  let fixture: ComponentFixture<CollectionNewComponent>;
  let store: MockStore;

  class MockStore {
    books$ = new BehaviorSubject<BookModel[]>([]);

    select(selector: unknown) {
      if (selector === selectAllBooks) return this.books$.asObservable();
      return of([]);
    }

    dispatch() {}
  }

  beforeEach(async () => {
    store = new MockStore();
    await TestBed.configureTestingModule({
      imports: [CollectionNewComponent],
      providers: [{ provide: Store, useValue: store }],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionNewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the create collection header and form', () => {
    fixture.detectChanges();
    const header = fixture.debugElement.query(By.css('.page-header h1'));
    expect(header.nativeElement.textContent).toContain('Create New Collection');

    const form = fixture.debugElement.query(By.directive(CollectionFormComponent));
    expect(form).toBeTruthy();
  });
});
