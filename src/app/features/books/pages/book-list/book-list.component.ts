import { Component, EventEmitter, Output, computed, inject, signal } from '@angular/core';
import { CollectionModel } from '../../../collections/models/collections.model';
import { BookModel } from '../../models/books.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from '../../../../shared/ui/confirm-modal/confirm-modal.component';
import { LibraryApiService } from '../../../../core/api/library-api.service';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, ConfirmModalComponent],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
})
export class BookListComponent {
  private api = inject(LibraryApiService);

  books = signal<BookModel[]>([]);
  collections = signal<CollectionModel[]>([]);

  bookToDelete = signal<BookModel | null>(null);

  filterControl = new FormControl('', { nonNullable: true });
  filterQuery = signal('');

  constructor() {
    this.api.getCollections().subscribe((c) => this.collections.set(c));
    this.api.getBooks().subscribe((b) => this.books.set(b));
    this.filterControl.valueChanges.subscribe((val) => this.filterQuery.set(val));
  }

  hasCollections = computed(() => this.collections().length > 0);

  getCollectionName = (id: number): string | undefined =>
    this.collections().find((c) => c.id === id)?.name;

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

    this.api.deleteBook(book.id).subscribe(() => {
      this.books.update((prev) => prev.filter((b) => b.id !== book.id));
      this.bookToDelete.set(null);
    });
  }

  trackByBookId(_index: number, item: BookModel) {
    return item.id;
  }

  stars(rating: number): string {
    const r = Math.max(0, Math.min(5, rating));
    return `Rating: ${r}`;
  }
}
