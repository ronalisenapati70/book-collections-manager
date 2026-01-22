import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BookModel } from '../../models/books.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from '../../../../shared/ui/confirm-modal/confirm-modal.component';
import { Store } from '@ngrx/store';

import { loadBooks, deleteBook } from '../../store/books.actions';
import { loadCollections } from '../../../collections/store/collections.actions';
import { selectAllBooks, selectBooksError } from '../../store/books.selectors';
import {
  selectAllCollections,
  selectCollectionsError,
} from '../../../collections/store/collections.selectors';
import { BookCardComponent } from '../../components/book-card/book-card.component';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, ConfirmModalComponent, BookCardComponent],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookListComponent implements OnInit {
  private store = inject(Store);

  books = toSignal(this.store.select(selectAllBooks), { initialValue: [] });
  booksError = toSignal(this.store.select(selectBooksError), { initialValue: null });
  collections = toSignal(this.store.select(selectAllCollections), { initialValue: [] });
  collectionsError = toSignal(this.store.select(selectCollectionsError), { initialValue: null });

  bookToDelete = signal<BookModel | null>(null);

  filterControl = new FormControl('', { nonNullable: true });
  filterQuery = signal('');

  ngOnInit(): void {
    this.store.dispatch(loadCollections());
    this.store.dispatch(loadBooks());
    this.filterControl.valueChanges.subscribe((val) => this.filterQuery.set(val));
  }

  getCollectionName = (id: number | null): string | undefined =>
    id === null ? undefined : this.collections().find((c) => c.id === id)?.name;

  getCollectionTheme = (id: number | null): string =>
    id === null ? 'slate' : this.collections().find((c) => c.id === id)?.theme ?? 'slate';

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

  getCollectionLink(id: number | null): string | any[] | null {
    return id === null ? null : ['/collections', id];
  }
}
