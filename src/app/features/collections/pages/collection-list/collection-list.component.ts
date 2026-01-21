import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { ConfirmModalComponent } from '../../../../shared/ui/confirm-modal/confirm-modal.component';
import { CollectionModel } from '../../models/collections.model';
import { loadCollections, deleteCollection } from '../../store/collections.actions';
import { loadBooks } from '../../../books/store/books.actions';
import { selectAllCollections } from '../../store/collections.selectors';
import { selectAllBooks } from '../../../books/store/books.selectors';

@Component({
  selector: 'app-collection-list',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, ConfirmModalComponent],
  templateUrl: './collection-list.component.html',
  styleUrl: './collection-list.component.scss',
})
export class CollectionListComponent {
  private store = inject(Store);

  collections = toSignal(this.store.select(selectAllCollections), { initialValue: [] });
  private books = toSignal(this.store.select(selectAllBooks), { initialValue: [] });

  itemToDelete = signal<CollectionModel | null>(null);

  filterControl = new FormControl('', { nonNullable: true });
  filterQuery = signal('');

  constructor() {
    this.store.dispatch(loadCollections());
    this.store.dispatch(loadBooks());

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

    this.store.dispatch(deleteCollection({ id: col.id }));
    this.itemToDelete.set(null);
  }

  trackById(_index: number, item: CollectionModel) {
    return item.id;
  }
}
