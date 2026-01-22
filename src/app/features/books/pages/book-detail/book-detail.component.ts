import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { BookFormComponent } from '../../components/book-form/book-form.component';
import { BookModel } from '../../models/books.model';
import { loadBooks, updateBook } from '../../store/books.actions';
import { loadCollections } from '../../../collections/store/collections.actions';
import {
  selectAllBooks,
  selectBooksError,
  selectBooksLoading,
} from '../../store/books.selectors';
import {
  selectAllCollections,
  selectCollectionsError,
} from '../../../collections/store/collections.selectors';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [RouterLink, CommonModule, BookFormComponent],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);

  books = toSignal(this.store.select(selectAllBooks), { initialValue: [] });
  booksLoading = toSignal(this.store.select(selectBooksLoading), { initialValue: true });
  booksError = toSignal(this.store.select(selectBooksError), { initialValue: null });
  collections = toSignal(this.store.select(selectAllCollections), { initialValue: [] });
  collectionsError = toSignal(this.store.select(selectCollectionsError), { initialValue: null });

  private bookId = signal<number | null>(null);

  bookForm = new FormGroup({
    collectionId: new FormControl<number | null>(null),
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    author: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    rating: new FormControl<number>(5, { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
  });

  // Finds the book based on route param bookId
  book = computed(() => {
    const id = this.bookId();
    if (id === null || Number.isNaN(id)) return undefined;
    return this.books().find((b) => b.id === id);
  });

  // Finds the collection the current book belongs to
  collection = computed(() => {
    const b = this.book();
    if (!b) return undefined;
    return this.collections().find((c) => c.id === b.collectionId);
  });

  constructor() {
    effect(() => {
      const b = this.book();
      if (!b) {
        this.resetFormEmpty();
        return;
      }

      this.bookForm.reset({
        collectionId: b.collectionId,
        title: b.title,
        author: b.author,
        rating: b.rating,
        description: b.description,
      });
    });
  }

  ngOnInit(): void {
    this.store.dispatch(loadCollections());
    this.store.dispatch(loadBooks());

    // Load book whenever route param changes
    this.route.paramMap.subscribe((pm) => {
      const raw = pm.get('bookId');
      const id = raw ? Number(raw) : null;
      this.bookId.set(id);

    });
  }

  private resetFormEmpty() {
    this.bookForm.reset({
      collectionId: null,
      title: '',
      author: '',
      rating: 5,
      description: '',
    });
  }

  saveBook(): void {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    const current = this.book();
    if (!current) return;

    const value = this.bookForm.getRawValue();

    const updated: BookModel = {
      id: current.id,
      collectionId:
        value.collectionId === null || value.collectionId === undefined
          ? null
          : Number(value.collectionId),
      title: value.title,
      author: value.author,
      rating: Number(value.rating),
      description: value.description,
    };

    this.store.dispatch(updateBook({ book: updated }));
    this.router.navigateByUrl('/books');
  }

}
