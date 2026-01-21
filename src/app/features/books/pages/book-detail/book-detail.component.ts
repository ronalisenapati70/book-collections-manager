import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ConfirmModalComponent } from '../../../../shared/ui/confirm-modal/confirm-modal.component';
import { LibraryApiService } from '../../../../core/api/library-api.service';
import { BookModel } from '../../models/books.model';
import { CollectionModel } from '../../../collections/models/collections.model';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, ConfirmModalComponent],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.scss',
})
export class BookDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(LibraryApiService);

  // Loaded state from API
  private _book = signal<BookModel | null>(null);
  private _collections = signal<CollectionModel[]>([]);

  // Exposed for template usage
  collections = computed(() => this._collections());

  private bookId = signal<number | null>(null);

  // Confirm modal state
  bookToDelete = signal<BookModel | null>(null);

  bookForm = new FormGroup({
    collectionId: new FormControl<number | null>(null, { validators: [Validators.required] }),
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    author: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    rating: new FormControl<number>(5, { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
  });

  // Template computeds
  book = computed(() => this._book() ?? undefined);

  collection = computed(() => {
    const b = this._book();
    if (!b) return undefined;
    return this._collections().find((c) => c.id === b.collectionId);
  });

  isEditMode = computed(() => !!this._book());
  editingBook = computed(() => this._book());

  constructor() {
    // Load collections once (for collection link / optional display)
    this.api.getCollections().subscribe((c) => this._collections.set(c));

    // Load book whenever route param changes
    this.route.paramMap.subscribe((pm) => {
      const raw = pm.get('bookId');
      const id = raw ? Number(raw) : null;
      this.bookId.set(id);

      // reset modal state on route change
      this.bookToDelete.set(null);

      if (id === null || Number.isNaN(id)) {
        this._book.set(null);
        this.resetFormEmpty();
        return;
      }

      this.api.getBook(id).subscribe({
        next: (b) => {
          this._book.set(b);
          this.bookForm.reset({
            collectionId: b.collectionId,
            title: b.title,
            author: b.author,
            rating: b.rating,
            description: b.description,
          });
        },
        error: () => {
          // If API returns 404, show "not found" state in template
          this._book.set(null);
          this.resetFormEmpty();
        },
      });
    });
  }

  private resetFormEmpty() {
    this.bookForm.reset({
      collectionId: null,
      title: '',
      author: '',
      rating: 5,
      description: '',
    });
  }

  trackById(_index: number, item: { id: number }): number {
    return item.id;
  }

  saveBook(): void {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    const current = this._book();
    if (!current) return;

    const value = this.bookForm.getRawValue();

    const updated: BookModel = {
      id: current.id,
      collectionId: value.collectionId!,
      title: value.title,
      author: value.author,
      rating: value.rating,
      description: value.description,
    };

    this.api.updateBook(updated).subscribe(() => {
      this.router.navigateByUrl('/books');
    });
  }

  confirmDelete(book: BookModel): void {
    this.bookToDelete.set(book);
  }

  deleteBook(): void {
    const b = this.bookToDelete();
    if (!b) return;

    this.api.deleteBook(b.id).subscribe(() => {
      this.bookToDelete.set(null);
      this.router.navigateByUrl('/books');
    });
  }
}
