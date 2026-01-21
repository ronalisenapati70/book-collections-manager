import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { LibraryApiService } from '../../../../core/api/library-api.service';
import { BookModel } from '../../models/books.model';
import { CollectionModel } from '../../../collections/models/collections.model';

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
  private api = inject(LibraryApiService);

  collections = signal<CollectionModel[]>([]);

  bookId = signal<number | null>(null);
  isEditMode = computed(() => this.bookId() !== null);

  private _editingBook = signal<BookModel | null>(null);
  editingBook = computed(() => this._editingBook());

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
    // Load collections for dropdown
    this.api.getCollections().subscribe((c) => this.collections.set(c));

    // Preselect collectionId when coming from collection detail via query param
    this.route.queryParamMap.subscribe((qp) => {
      const raw = qp.get('collectionId');
      if (raw && !this.isEditMode()) {
        this.bookForm.controls.collectionId.setValue(Number(raw));
      }
    });

    // Edit mode support (if route contains :bookId)
    this.route.paramMap.subscribe((pm) => {
      const raw = pm.get('bookId'); // change to 'id' if your route uses :id
      const id = raw ? Number(raw) : null;
      this.bookId.set(id);

      if (id === null) {
        this._editingBook.set(null);
        return;
      }

      this.api.getBook(id).subscribe((b) => {
        this._editingBook.set(b);
        this.bookForm.reset({
          collectionId: b.collectionId,
          title: b.title,
          author: b.author,
          rating: b.rating,
          description: b.description,
        });
      });
    });
  }

  saveBook() {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    const value = this.bookForm.getRawValue();

    if (this.isEditMode()) {
      const id = this.bookId()!;
      const updated: BookModel = {
        id,
        collectionId: value.collectionId!,
        title: value.title,
        author: value.author,
        rating: value.rating,
        description: value.description,
      };

      this.api.updateBook(updated).subscribe(() => {
        this.router.navigateByUrl('/books');
      });

      return;
    }

    const created: BookModel = {
      id: 0, // in-memory API will assign the next id
      collectionId: value.collectionId!,
      title: value.title,
      author: value.author,
      rating: value.rating,
      description: value.description,
    };

    this.api.createBook(created).subscribe(() => {
      this.router.navigateByUrl('/books');
    });
  }

  trackByCollectionId(_index: number, item: CollectionModel) {
    return item.id;
  }
}
