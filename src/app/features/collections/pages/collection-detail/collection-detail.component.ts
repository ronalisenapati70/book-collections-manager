import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CollectionModel } from '../../models/collections.model';
import { BookModel } from '../../../books/models/books.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ConfirmModalComponent } from '../../../../shared/ui/confirm-modal/confirm-modal.component';
import { CommonModule } from '@angular/common';
import { MOCK_BOOKS, MOCK_COLLECTIONS } from '../../../../core/mock-data/mock-data.component';

@Component({
  selector: 'app-collection-detail',
  standalone: true,
  imports: [ConfirmModalComponent, RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './collection-detail.component.html',
  styleUrl: './collection-detail.component.scss',
})
export class CollectionDetailComponent {
  private route = inject(ActivatedRoute);

  collectionId = signal<number | null>(null);
  bookToDelete = signal<BookModel | null>(null);

  filterControl = new FormControl('', { nonNullable: true });
  filterQuery = signal('');

  // Local mock data (replace later with API/NgRx)
  collections = signal<CollectionModel[]>([...MOCK_COLLECTIONS]);

  books = signal<BookModel[]>([...MOCK_BOOKS]);

  constructor() {
    // Must match your route param: /collections/:collectionId
    this.route.paramMap.subscribe((params) => {
      const raw = params.get('collectionId');
      this.collectionId.set(raw ? Number(raw) : null);
    });

    this.filterControl.valueChanges.subscribe((val) => this.filterQuery.set(val));
  }

  collection = computed(() => {
    const id = this.collectionId();
    if (!id) return undefined;
    return this.collections().find((c) => c.id === id);
  });

  collectionBooks = computed(() => {
    const id = this.collectionId();
    if (!id) return [];
    return this.books().filter((b) => b.collectionId === id);
  });

  filteredBooks = computed(() => {
    const query = this.filterQuery().trim().toLowerCase();
    const items = this.collectionBooks();

    if (!query) return items;

    return items.filter((b) => {
      return b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query);
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

    this.books.update((prev) => prev.filter((b) => b.id !== book.id));
    this.bookToDelete.set(null);
  }

  trackByBookId(_index: number, item: BookModel) {
    return item.id;
  }

  stars(rating: number): string {
    const r = Math.max(0, Math.min(5, rating));
    return `Rating: ${r}`;
  }

  initials(title: string): string {
    return title
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]!.toUpperCase())
      .join('');
  }
}
