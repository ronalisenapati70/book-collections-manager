import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ConfirmModalComponent } from '../../../../shared/ui/confirm-modal/confirm-modal.component';
import { LibraryApiService } from '../../../../core/api/library-api.service';
import { BookModel } from '../../../books/models/books.model';
import { CollectionModel } from '../../models/collections.model';

@Component({
  selector: 'app-collection-detail',
  standalone: true,
  imports: [ConfirmModalComponent, RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './collection-detail.component.html',
  styleUrl: './collection-detail.component.scss',
})
export class CollectionDetailComponent {
  private route = inject(ActivatedRoute);
  private api = inject(LibraryApiService);

  collectionId = signal<number | null>(null);
  bookToDelete = signal<BookModel | null>(null);
  isEditing = signal(false);

  filterControl = new FormControl('', { nonNullable: true });
  filterQuery = signal('');

  readonly colors = [
    'teal',
    'emerald',
    'rose',
    'amber',
    'cyan',
    'fuchsia',
    'indigo',
    'slate',
    'violet',
    'orange',
  ] as const;

  collectionForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    theme: new FormControl<(typeof this.colors)[number]>('indigo', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  // API-backed state
  private _collection = signal<CollectionModel | null>(null);
  private _books = signal<BookModel[]>([]);

  constructor() {
    // Load all books once (small app). Alternatively: filter on server later.
    this.api.getBooks().subscribe((b) => this._books.set(b));

    // route param: /collections/:collectionId
    this.route.paramMap.subscribe((params) => {
      const raw = params.get('collectionId');
      const id = raw ? Number(raw) : null;
      this.collectionId.set(id);

      // reset modal when navigating between collections
      this.bookToDelete.set(null);

      if (id === null || Number.isNaN(id)) {
        this._collection.set(null);
        return;
      }

      // load the collection
      this.api.getCollection(id).subscribe({
        next: (c) => {
          this._collection.set(c);
          this.collectionForm.patchValue({
            name: c.name,
            description: c.description,
            theme: c.theme as any,
          });
        },
        error: () => this._collection.set(null),
      });
    });

    this.filterControl.valueChanges.subscribe((val) => this.filterQuery.set(val));
  }

  // Computeds for template
  collection = computed(() => this._collection() ?? undefined);

  collectionBooks = computed(() => {
    const id = this.collectionId();
    if (!id) return [];
    return this._books().filter((b) => b.collectionId === id);
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

    this.api.deleteBook(book.id).subscribe(() => {
      this._books.update((prev) => prev.filter((b) => b.id !== book.id));
      this.bookToDelete.set(null);
    });
  }

  startEditCollection() {
    if (!this._collection()) return;
    this.isEditing.set(true);
  }

  cancelEditCollection() {
    const c = this._collection();
    if (c) {
      this.collectionForm.patchValue({
        name: c.name,
        description: c.description,
        theme: c.theme as any,
      });
    }
    this.isEditing.set(false);
  }

  saveCollection() {
    if (this.collectionForm.invalid) return;
    const c = this._collection();
    if (!c) return;

    const updated = {
      ...c,
      name: this.collectionForm.value.name!,
      description: this.collectionForm.value.description!,
      theme: this.collectionForm.value.theme!,
    };

    // Optimistic UI update so theme/name changes render immediately.
    this._collection.set(updated);
    this.isEditing.set(false);

    this.api.updateCollection(updated).subscribe({
      next: (saved) => {
        if (saved && saved.id) {
          this._collection.set(saved);
        } else {
          this._collection.set(updated);
        }
      },
      error: () => this._collection.set(c),
    });
  }

  trackByColor(_index: number, color: string) {
    return color;
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
