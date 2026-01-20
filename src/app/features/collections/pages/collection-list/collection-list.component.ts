import { Component, computed, signal } from '@angular/core';
import { CollectionModel } from '../../models/collections.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from '../../../../shared/ui/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-collection-list',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, ConfirmModalComponent],
  templateUrl: './collection-list.component.html',
  styleUrl: './collection-list.component.scss',
})
export class CollectionListComponent {
  // Mock local state for now (replace with NgRx/store later)
  collections = signal<CollectionModel[]>([
    {
      id: 1,
      name: 'Productivity',
      description: 'Books that help me work smarter.',
      createdAt: '2024-06-01T00:00:00.000Z',
      theme: 'indigo',
    },
    {
      id: 2,
      name: 'Fiction',
      description: 'Novels and stories to unwind.',
      createdAt: '2024-09-15T00:00:00.000Z',
      theme: 'emerald',
    },
    {
      id: 3,
      name: 'Tech & Architecture',
      description: 'System design, engineering, and craft.',
      createdAt: '2025-01-10T00:00:00.000Z',
      theme: 'rose',
    },
    {
      id: 4,
      name: 'Wellness',
      description: 'Mind, body, and healthy habits.',
      createdAt: '2024-11-20T00:00:00.000Z',
      theme: 'teal',
    },
    {
      id: 5,
      name: 'Biographies',
      description: 'Stories of remarkable lives.',
      createdAt: '2024-04-08T00:00:00.000Z',
      theme: 'amber',
    },
    {
      id: 6,
      name: 'Design',
      description: 'Visual systems, UX, and product craft.',
      createdAt: '2024-12-05T00:00:00.000Z',
      theme: 'violet',
    },
    {
      id: 7,
      name: 'Science',
      description: 'Curiosity, experiments, and discoveries.',
      createdAt: '2025-02-02T00:00:00.000Z',
      theme: 'cyan',
    },
    {
      id: 8,
      name: 'History',
      description: 'Timelines, cultures, and turning points.',
      createdAt: '2023-10-14T00:00:00.000Z',
      theme: 'orange',
    },
    {
      id: 9,
      name: 'Travel',
      description: 'Places, guides, and stories on the road.',
      createdAt: '2024-07-22T00:00:00.000Z',
      theme: 'pink',
    },
    {
      id: 10,
      name: 'Finance',
      description: 'Investing, markets, and money habits.',
      createdAt: '2024-05-30T00:00:00.000Z',
      theme: 'emerald',
    },
  ]);

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
