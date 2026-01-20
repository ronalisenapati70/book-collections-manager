import { Component, computed, signal } from '@angular/core';
import { CollectionModel } from '../../models/collections.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from '../../../../shared/ui/confirm-modal/confirm-modal.component';
import { MOCK_COLLECTIONS } from '../../../../core/mock-data/mock-data.component';

@Component({
  selector: 'app-collection-list',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, ConfirmModalComponent],
  templateUrl: './collection-list.component.html',
  styleUrl: './collection-list.component.scss',
})
export class CollectionListComponent {
  // Mock local state for now (replace with NgRx/store later)
  collections = signal<CollectionModel[]>([...MOCK_COLLECTIONS]);

  // Delete confirmation (we’ll hook this to a confirm dialog component later)
  itemToDelete = signal<CollectionModel | null>(null);

  // Filter input
  filterControl = new FormControl('', { nonNullable: true });
  filterQuery = signal('');

  constructor() {
    this.filterControl.valueChanges.subscribe((val) => this.filterQuery.set(val));
  }

  filteredCollections = computed(() => {
    const query = this.filterQuery().trim().toLowerCase();
    const items = this.collections();

    if (!query) return items;

    return items.filter((c) => {
      const name = c.name.toLowerCase();
      const desc = c.description.toLowerCase();
      return name.includes(query) || desc.includes(query);
    });
  });
  // Temporary stub until books exist
  getBooksCountByCollectionId(_collectionId: number): number {
    return 0;
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

    this.collections.update((prev) => prev.filter((c) => c.id !== col.id));
    this.itemToDelete.set(null);
  }

  trackById(_index: number, item: CollectionModel) {
    return item.id;
  }
}
