import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { ConfirmModalComponent } from '../../../../shared/ui/confirm-modal/confirm-modal.component';
import { BookModel } from '../../models/books.model';
import { loadBooks, updateBook, deleteBook } from '../../store/books.actions';
import { loadCollections } from '../../../collections/store/collections.actions';
import { selectAllBooks, selectBooksLoading } from '../../store/books.selectors';
import { selectAllCollections } from '../../../collections/store/collections.selectors';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, ConfirmModalComponent],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.scss',
})
export class BookDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);

  books = toSignal(this.store.select(selectAllBooks), { initialValue: [] });
  booksLoading = toSignal(this.store.select(selectBooksLoading), { initialValue: true });
  collections = toSignal(this.store.select(selectAllCollections), { initialValue: [] });

  private bookId = signal<number | null>(null);

  // Confirm modal state
  bookToDelete = signal<BookModel | null>(null);

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

  // Template computeds
  book = computed(() => {
    const id = this.bookId();
    if (id === null || Number.isNaN(id)) return undefined;
    return this.books().find((b) => b.id === id);
  });

  collection = computed(() => {
    const b = this.book();
    if (!b) return undefined;
    return this.collections().find((c) => c.id === b.collectionId);
  });

  isEditMode = computed(() => !!this.book());
  editingBook = computed(() => this.book());

  constructor() {
    this.store.dispatch(loadCollections());
    this.store.dispatch(loadBooks());

    // Load book whenever route param changes
    this.route.paramMap.subscribe((pm) => {
      const raw = pm.get('bookId');
      const id = raw ? Number(raw) : null;
      this.bookId.set(id);

      // reset modal state on route change
      this.bookToDelete.set(null);
    });

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

  private resetFormEmpty() {
    this.bookForm.reset({
      collectionId: null,
      title: '',
      author: '',
      rating: 5,
      description: '',
    });
  }

  trackById(_index: number, item: { id: number }): number {
    return item.id;
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

  confirmDelete(book: BookModel): void {
    this.bookToDelete.set(book);
  }

  deleteBook(): void {
    const b = this.bookToDelete();
    if (!b) return;

    this.store.dispatch(deleteBook({ id: b.id }));
    this.bookToDelete.set(null);
    this.router.navigateByUrl('/books');
  }
}
