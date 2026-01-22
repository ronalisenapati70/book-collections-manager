import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BookModel } from '../../models/books.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from '../../../../shared/ui/confirm-modal/confirm-modal.component';
import { Store } from '@ngrx/store';

import { loadBooks, deleteBook } from '../../store/books.actions';
import { loadCollections } from '../../../collections/store/collections.actions';
import { selectAllBooks } from '../../store/books.selectors';
import { selectAllCollections } from '../../../collections/store/collections.selectors';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, ConfirmModalComponent],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
})
export class BookListComponent {
  private store = inject(Store);

  books = toSignal(this.store.select(selectAllBooks), { initialValue: [] });
  collections = toSignal(this.store.select(selectAllCollections), { initialValue: [] });

  bookToDelete = signal<BookModel | null>(null);

  filterControl = new FormControl('', { nonNullable: true });
  filterQuery = signal('');

  constructor() {
    this.store.dispatch(loadCollections());
    this.store.dispatch(loadBooks());
    this.filterControl.valueChanges.subscribe((val) => this.filterQuery.set(val));
  }

  hasCollections = computed(() => this.collections().length > 0);

  getCollectionName = (id: number | null): string | undefined =>
    id === null ? undefined : this.collections().find((c) => c.id === id)?.name;

  getCollectionTheme = (id: number | null): string => {
    const theme = id === null ? 'slate' : this.collections().find((c) => c.id === id)?.theme;
    switch (theme) {
      case 'indigo':
        return 'rgba(99, 102, 241, 0.7)';
      case 'emerald':
        return 'rgba(16, 185, 129, 0.7)';
      case 'rose':
        return 'rgba(244, 63, 94, 0.65)';
      case 'amber':
        return 'rgba(245, 158, 11, 0.65)';
      case 'cyan':
        return 'rgba(6, 182, 212, 0.65)';
      case 'violet':
        return 'rgba(139, 92, 246, 0.7)';
      case 'teal':
        return 'rgba(20, 184, 166, 0.65)';
      default:
        return 'rgba(100, 116, 139, 0.35)';
    }
  };

  filteredBooks = computed(() => {
    const query = this.filterQuery().trim().toLowerCase();
    const items = this.books();

    if (!query) return items;

    return items.filter((b) => {
      const colName = (this.getCollectionName(b.collectionId) ?? '').toLowerCase();
      return (
        b.title.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query) ||
        colName.includes(query)
      );
    });
  });

  confirmDeleteBook(book: BookModel) {
    this.bookToDelete.set(book);
  }

  cancelDeleteBook() {
    this.bookToDelete.set(null);
  }

  deleteBook() {
    const book = this.bookToDelete();
    if (!book) return;

    this.store.dispatch(deleteBook({ id: book.id }));
    this.bookToDelete.set(null);
  }

  trackByBookId(_index: number, item: BookModel) {
    return item.id;
  }

  stars(rating: number): string {
    const r = Math.max(0, Math.min(5, rating));
    return `Rating: ${r}`;
  }
}
