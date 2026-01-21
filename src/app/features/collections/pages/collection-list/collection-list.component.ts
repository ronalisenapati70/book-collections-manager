import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ConfirmModalComponent } from '../../../../shared/ui/confirm-modal/confirm-modal.component';
import { LibraryApiService } from '../../../../core/api/library-api.service';
import { CollectionModel } from '../../models/collections.model';
import { BookModel } from '../../../books/models/books.model';

@Component({
  selector: 'app-collection-list',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, ConfirmModalComponent],
  templateUrl: './collection-list.component.html',
  styleUrl: './collection-list.component.scss',
})
export class CollectionListComponent {
  private api = inject(LibraryApiService);

  collections = signal<CollectionModel[]>([]);
  private books = signal<BookModel[]>([]);

  itemToDelete = signal<CollectionModel | null>(null);

  filterControl = new FormControl('', { nonNullable: true });
  filterQuery = signal('');

  constructor() {
    this.api.getCollections().subscribe((c) => this.collections.set(c));
    this.api.getBooks().subscribe((b) => this.books.set(b));

    this.filterControl.valueChanges.subscribe((val) => this.filterQuery.set(val));
  }

  filteredCollections = computed(() => {
    const query = this.filterQuery().trim().toLowerCase();
    const items = this.collections();

    if (!query) return items;

    return items.filter((c) => {
      const name = c.name.toLowerCase();
      const desc = (c.description ?? '').toLowerCase();
      return name.includes(query) || desc.includes(query);
    });
  });

  getBooksCountByCollectionId(collectionId: number): number {
    return this.books().filter((b) => b.collectionId === collectionId).length;
  }

  confirmDelete(col: CollectionModel) {
    this.itemToDelete.set(col);
  }

  cancelDelete() {
    this.itemToDelete.set(null);
  }

  deleteCollection() {
    const col = this.itemToDelete();
    if (!col) return;

    this.api.deleteCollection(col.id).subscribe(() => {
      this.collections.update((prev) => prev.filter((c) => c.id !== col.id));
      this.books.update((prev) => prev.filter((b) => b.collectionId !== col.id)); // optional
      this.itemToDelete.set(null);
    });
  }

  trackById(_index: number, item: CollectionModel) {
    return item.id;
  }
}
