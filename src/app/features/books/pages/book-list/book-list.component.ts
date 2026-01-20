import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { CollectionModel } from '../../../collections/models/collections.model';
import { MOCK_BOOKS, MOCK_COLLECTIONS } from '../../../../core/mock-data/mock-data.component';
import { BookModel } from '../../models/books.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from '../../../../shared/ui/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, ConfirmModalComponent],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
})
export class BookListComponent {
  // 👇 Mock data now lives outside the component
  private collectionsSignal = signal<CollectionModel[]>([...MOCK_COLLECTIONS]);
  private booksSignal = signal<BookModel[]>([...MOCK_BOOKS]);

  bookToDelete = signal<BookModel | null>(null);

  filterControl = new FormControl('', { nonNullable: true });
  filterQuery = signal('');

  @Input() set collections(value: CollectionModel[] | null | undefined) {
    if (value) this.collectionsSignal.set([...value]);
  }

  @Input() set books(value: BookModel[] | null | undefined) {
    if (value) this.booksSignal.set([...value]);
  }

  @Output() bookDeleted = new EventEmitter<BookModel>();
  @Output() deleteCanceled = new EventEmitter<void>();

  constructor() {
    this.filterControl.valueChanges.subscribe((val) => this.filterQuery.set(val));
  }

  hasCollections = computed(() => this.collectionsSignal().length > 0);

  getCollectionName = (id: number): string | undefined =>
    this.collectionsSignal().find((c) => c.id === id)?.name;

  filteredBooks = computed(() => {
    const query = this.filterQuery().trim().toLowerCase();
    const items = this.booksSignal();

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
    this.deleteCanceled.emit();
  }

  deleteBook() {
    const book = this.bookToDelete();
    if (!book) return;

    this.booksSignal.update((prev) => prev.filter((b) => b.id !== book.id));
    this.bookToDelete.set(null);
    this.bookDeleted.emit(book);
  }

  trackByBookId(_index: number, item: BookModel) {
    return item.id;
  }

  stars(rating: number): string {
    const r = Math.max(0, Math.min(5, rating));
    return `Rating: ${r}`;
  }
}
