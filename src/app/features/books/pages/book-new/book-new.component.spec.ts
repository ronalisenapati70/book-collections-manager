import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { BookNewComponent } from './book-new.component';
import { CollectionModel } from '../../../collections/models/collections.model';
import { selectAllCollections } from '../../../collections/store/collections.selectors';
import { BookFormComponent } from '../../components/book-form/book-form.component';

describe('BookNewComponent', () => {
  let component: BookNewComponent;
  let fixture: ComponentFixture<BookNewComponent>;
  let store: MockStore;

  class MockStore {
    collections$ = new BehaviorSubject<CollectionModel[]>([]);

    select(selector: unknown) {
      if (selector === selectAllCollections) return this.collections$.asObservable();
      return of([]);
    }

    dispatch() {}
  }

  beforeEach(async () => {
    store = new MockStore();
    await TestBed.configureTestingModule({
      imports: [BookNewComponent],
      providers: [
        { provide: Store, useValue: store },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of(convertToParamMap({})),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookNewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the add book header and form', () => {
    fixture.detectChanges();
    const header = fixture.debugElement.query(By.css('.page-header h1'));
    expect(header.nativeElement.textContent).toContain('Add New Book');

    const form = fixture.debugElement.query(By.directive(BookFormComponent));
    expect(form).toBeTruthy();
  });
});
