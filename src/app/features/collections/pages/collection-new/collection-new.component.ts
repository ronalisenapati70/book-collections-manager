import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { take } from 'rxjs';

import { createCollection, createCollectionSuccess } from '../../store/collections.actions';
import { loadBooks, updateBook } from '../../../books/store/books.actions';
import { selectAllBooks } from '../../../books/store/books.selectors';
import { BookModel } from '../../../books/models/books.model';
import {
  COLLECTION_THEME_COLORS,
  CollectionThemeColor,
} from '../../../../shared/constants/color-themes';

@Component({
  selector: 'app-collection-new',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './collection-new.component.html',
  styleUrl: './collection-new.component.scss',
})
export class CollectionNewComponent {
  private router = inject(Router);
  private store = inject(Store);
  private actions$ = inject(Actions);

  books = toSignal(this.store.select(selectAllBooks), { initialValue: [] });
  unassignedBooks = computed(() =>
    this.books().filter((book) => book.collectionId === null),
  );

  collectionForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
  selectedBookIds = new FormControl<number[]>([], { nonNullable: true });
  readonly colors = COLLECTION_THEME_COLORS;
  selectedColor = signal<CollectionThemeColor>('indigo');

  constructor() {
    this.store.dispatch(loadBooks());
  }

  trackByColor(_index: number, color: string) {
    return color;
  }

  trackByBookId(_index: number, item: BookModel) {
    return item.id;
  }

  toggleBookSelection(id: number, checked: boolean) {
    const current = this.selectedBookIds.value;
    this.selectedBookIds.setValue(
      checked ? [...current, id] : current.filter((bookId) => bookId !== id),
    );
  }

  createCollection() {
    if (this.collectionForm.invalid) return;
    const newCollection = {
      name: this.collectionForm.value.name!,
      description: this.collectionForm.value.description!,
      theme: this.selectedColor(),
      createdAt: new Date().toISOString(),
    };

    this.store.dispatch(createCollection({ collection: newCollection }));
    this.actions$
      .pipe(ofType(createCollectionSuccess), take(1))
      .subscribe(({ collection }) => {
        const selectedIds = this.selectedBookIds.value;
        selectedIds.forEach((id) => {
          const book = this.books().find((item) => item.id === id);
          if (!book) return;
          this.store.dispatch(updateBook({ book: { ...book, collectionId: collection.id } }));
        });

        this.router.navigateByUrl('/collections');
      });
  }
}
