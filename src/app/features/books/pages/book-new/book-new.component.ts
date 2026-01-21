import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { BookModel } from '../../models/books.model';
import { CollectionModel } from '../../../collections/models/collections.model';
import { loadBooks, createBook, updateBook } from '../../store/books.actions';
import { loadCollections } from '../../../collections/store/collections.actions';
import { selectAllBooks } from '../../store/books.selectors';
import { selectAllCollections } from '../../../collections/store/collections.selectors';

@Component({
  selector: 'app-book-new',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './book-new.component.html',
  styleUrl: './book-new.component.scss',
})
export class BookNewComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private store = inject(Store);

  collections = toSignal(this.store.select(selectAllCollections), { initialValue: [] });
  books = toSignal(this.store.select(selectAllBooks), { initialValue: [] });

  bookId = signal<number | null>(null);
  isEditMode = computed(() => this.bookId() !== null);

  editingBook = computed(() => {
    const id = this.bookId();
    if (id === null || Number.isNaN(id)) return undefined;
    return this.books().find((b) => b.id === id);
  });

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

  constructor() {
    this.store.dispatch(loadCollections());
    this.store.dispatch(loadBooks());

    // Preselect collectionId when coming from collection detail via query param
    this.route.queryParamMap.subscribe((qp) => {
      const raw = qp.get('collectionId');
      if (raw && !this.isEditMode()) {
        this.bookForm.controls.collectionId.setValue(Number(raw));
      }
    });

    // Edit mode support (if route contains :bookId)
    this.route.paramMap.subscribe((pm) => {
      const raw = pm.get('bookId'); // change to 'id' if your route uses :id
      const id = raw ? Number(raw) : null;
      this.bookId.set(id);
    });

    effect(() => {
      const book = this.editingBook();
      if (!book) {
        if (this.isEditMode()) {
          this.bookForm.reset({
            collectionId: null,
            title: '',
            author: '',
            rating: 5,
            description: '',
          });
        }
        return;
      }

      this.bookForm.reset({
        collectionId: book.collectionId,
        title: book.title,
        author: book.author,
        rating: book.rating,
        description: book.description,
      });
    });
  }

  saveBook() {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    const value = this.bookForm.getRawValue();

    if (this.isEditMode()) {
      const id = this.bookId()!;
      const updated: BookModel = {
        id,
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

      return;
    }

    const created = {
      collectionId:
        value.collectionId === null || value.collectionId === undefined
          ? null
          : Number(value.collectionId),
      title: value.title,
      author: value.author,
      rating: Number(value.rating),
      description: value.description,
    };

    this.store.dispatch(createBook({ book: created }));
    this.router.navigateByUrl('/books');
  }

  trackByCollectionId(_index: number, item: CollectionModel) {
    return item.id;
  }
}
