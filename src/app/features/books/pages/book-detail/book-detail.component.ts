import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CollectionModel } from '../../../collections/models/collections.model';
import { MOCK_BOOKS, MOCK_COLLECTIONS } from '../../../../core/mock-data/mock-data.component';
import { BookModel } from '../../models/books.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from '../../../../shared/ui/confirm-modal/confirm-modal.component';

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

  // Local mock state (later replace with API/NgRx)
  private books = signal<BookModel[]>([...MOCK_BOOKS]);
  private _collections = signal<CollectionModel[]>([...MOCK_COLLECTIONS]);

  // Exposed for template (collections())
  collections = computed(() => this._collections());

  // Route param state
  private bookId = signal<number | null>(null);

  // Delete confirm state (used by app-confirm-modal)
  bookToDelete = signal<BookModel | null>(null);

  // Form
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

  // Computeds for template
  book = computed(() => {
    const id = this.bookId();
    if (!id) return undefined;
    return this.books().find((b) => b.id === id);
  });

  collection = computed(() => {
    const b = this.book();
    if (!b) return undefined;
    return this._collections().find((c) => c.id === b.collectionId);
  });

  // In book detail we are effectively always editing an existing book
  isEditMode = computed(() => !!this.book());
  editingBook = computed(() => this.book() ?? null);

  constructor() {
    this.route.paramMap.subscribe((pm) => {
      // Change 'bookId' to 'id' if your route uses :id
      const raw = pm.get('bookId');
      this.bookId.set(raw ? Number(raw) : null);

      // Patch form from current book
      const b = this.book();
      if (b) {
        this.bookForm.reset({
          collectionId: b.collectionId,
          title: b.title,
          author: b.author,
          rating: b.rating,
          description: b.description,
        });
      } else {
        // if not found, keep form empty
        this.bookForm.reset({
          collectionId: null,
          title: '',
          author: '',
          rating: 5,
          description: '',
        });
      }

      // reset modal state when navigating to another book
      this.bookToDelete.set(null);
    });
  }

  // For *ngFor trackBy
  trackById(_index: number, item: { id: number }): number {
    return item.id;
  }

  // Submit handler from your HTML (ngSubmit)="saveBook()"
  saveBook(): void {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    const current = this.book();
    if (!current) return;

    const value = this.bookForm.getRawValue();

    this.books.update((prev) =>
      prev.map((b) =>
        b.id === current.id
          ? {
              ...b,
              collectionId: value.collectionId!,
              title: value.title,
              author: value.author,
              rating: value.rating,
              description: value.description,
            }
          : b,
      ),
    );

    // Optional: navigate back to list after save
    this.router.navigateByUrl('/books');
  }

  // Modal-driven delete
  confirmDelete(book: BookModel): void {
    this.bookToDelete.set(book);
  }

  deleteBook(): void {
    const b = this.bookToDelete();
    if (!b) return;

    this.books.update((prev) => prev.filter((x) => x.id !== b.id));
    this.bookToDelete.set(null);

    this.router.navigateByUrl('/books');
  }
}
