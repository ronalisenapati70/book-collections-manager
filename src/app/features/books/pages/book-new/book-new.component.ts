import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CollectionModel } from '../../../collections/models/collections.model';
import { MOCK_COLLECTIONS } from '../../../../core/mock-data/mock-data.component';
import { BookModel } from '../../models/books.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-new',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './book-new.component.html',
  styleUrl: './book-new.component.scss',
})
export class BookNewComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Local mock collections (replace later with API/NgRx)
  collections = signal<CollectionModel[]>([...MOCK_COLLECTIONS]);

  // Local mock books (only needed if you also want edit mode here later)
  private books = signal<BookModel[]>([
    {
      id: 1,
      collectionId: 1,
      title: 'Atomic Habits',
      author: 'James Clear',
      rating: 5,
      description: 'Practical strategies for building good habits.',
    },
  ]);

  // Route-driven mode: /books/new vs /books/:bookId
  bookId = signal<number | null>(null);
  isEditMode = computed(() => this.bookId() !== null);

  editingBook = computed(() => {
    const id = this.bookId();
    if (!id) return null;
    return this.books().find((b) => b.id === id) ?? null;
  });

  // Typed form
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

  constructor() {
    // Preselect collectionId when coming from /collections/:id (via query param)
    this.route.queryParamMap.subscribe((qp) => {
      const raw = qp.get('collectionId');
      if (raw) this.bookForm.controls.collectionId.setValue(Number(raw));
    });

    // If you ever reuse this component for /books/:bookId, keep this ready
    this.route.paramMap.subscribe((pm) => {
      const raw = pm.get('bookId'); // only exists on /books/:bookId
      this.bookId.set(raw ? Number(raw) : null);

      // If edit mode, patch values
      const b = this.editingBook();
      if (b) {
        this.bookForm.patchValue({
          collectionId: b.collectionId,
          title: b.title,
          author: b.author,
          rating: b.rating,
          description: b.description,
        });
      }
    });
  }

  saveBook() {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    const value = this.bookForm.getRawValue();

    if (this.isEditMode()) {
      // mock update
      const id = this.bookId()!;
      this.books.update((prev) =>
        prev.map((b) => (b.id === id ? ({ ...b, ...value, id } as BookModel) : b)),
      );
    } else {
      // mock create
      const newBook: BookModel = {
        id: Date.now(),
        collectionId: value.collectionId!,
        title: value.title,
        author: value.author,
        rating: value.rating,
        description: value.description,
      };
      this.books.update((prev) => [newBook, ...prev]);
    }

    this.router.navigateByUrl('/books');
  }

  trackByCollectionId(_index: number, item: CollectionModel) {
    return item.id;
  }
}
