import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { ConfirmModalComponent } from '../../../../shared/ui/confirm-modal/confirm-modal.component';
import { BookModel } from '../../../books/models/books.model';
import {
  COLLECTION_THEME_COLORS,
  CollectionThemeColor,
} from '../../../../shared/constants/color-themes';
import { CollectionFormComponent } from '../../components/collection-form/collection-form.component';
import { BookCardComponent } from '../../../books/components/book-card/book-card.component';
import { loadCollections, updateCollection } from '../../store/collections.actions';
import { loadBooks, deleteBook, updateBook } from '../../../books/store/books.actions';
import { selectAllCollections } from '../../store/collections.selectors';
import { selectAllBooks } from '../../../books/store/books.selectors';

@Component({
  selector: 'app-collection-detail',
  standalone: true,
  imports: [
    ConfirmModalComponent,
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    CollectionFormComponent,
    BookCardComponent,
  ],
  templateUrl: './collection-detail.component.html',
  styleUrl: './collection-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(Store);

  collectionId = signal<number | null>(null);
  bookToDelete = signal<BookModel | null>(null);
  isEditing = signal(false);

  filterControl = new FormControl('', { nonNullable: true });
  filterQuery = signal('');

  readonly colors = COLLECTION_THEME_COLORS;
  selectedBookIds = new FormControl<number[]>([], { nonNullable: true });

  collectionForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    theme: new FormControl<CollectionThemeColor>('indigo', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  collections = toSignal(this.store.select(selectAllCollections), { initialValue: [] });
  private books = toSignal(this.store.select(selectAllBooks), { initialValue: [] });

  constructor() {
    effect(() => {
      const c = this.collection();
      if (!c) {
        this.collectionForm.reset({ name: '', description: '', theme: 'indigo' });
        return;
      }

      this.collectionForm.patchValue({
        name: c.name,
        description: c.description,
        theme: c.theme as CollectionThemeColor,
      });
    });
  }

  ngOnInit(): void {
    this.store.dispatch(loadCollections());
    this.store.dispatch(loadBooks());

    // route param: /collections/:collectionId
    this.route.paramMap.subscribe((params) => {
      const raw = params.get('collectionId');
      const id = raw ? Number(raw) : null;
      this.collectionId.set(id);

      // reset modal when navigating between collections
      this.bookToDelete.set(null);
    });

    this.filterControl.valueChanges.subscribe((val) => this.filterQuery.set(val));
  }

  // Computeds for template
  collection = computed(() => {
    const id = this.collectionId();
    if (id === null || Number.isNaN(id)) return undefined;
    return this.collections().find((c) => c.id === id);
  });

  collectionBooks = computed(() => {
    const id = this.collectionId();
    if (id === null || Number.isNaN(id)) return [];
    return this.books().filter((b) => b.collectionId === id);
  });

  availableBooks = computed(() => this.books().filter((b) => b.collectionId === null));

  filteredBooks = computed(() => {
    const query = this.filterQuery().trim().toLowerCase();
    const items = this.collectionBooks();

    if (!query) return items;

    return items.filter((b) => {
      return b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query);
    });
  });

  getCollectionTheme(): string {
    return this.collection()?.theme ?? 'slate';
  }

  trackByBookId(_index: number, item: BookModel): number {
    return item.id;
  }

  confirmDeleteBook(book: BookModel) {
    this.bookToDelete.set(book);
  }

  cancelDeleteBook() {
    this.bookToDelete.set(null);
  }

  deleteBook() {
    const book = this.bookToDelete();
    if (!book) return;

    this.store.dispatch(deleteBook({ id: book.id }));
    this.bookToDelete.set(null);
  }

  toggleBookSelection(id: number, checked: boolean) {
    const current = this.selectedBookIds.value;
    this.selectedBookIds.setValue(
      checked ? [...current, id] : current.filter((bookId) => bookId !== id),
    );
  }

  startEditCollection() {
    if (!this.collection()) return;
    this.isEditing.set(true);
  }

  cancelEditCollection() {
    const c = this.collection();
    if (c) {
      this.collectionForm.patchValue({
        name: c.name,
        description: c.description,
        theme: c.theme as CollectionThemeColor,
      });
    }
    this.selectedBookIds.setValue([]);
    this.isEditing.set(false);
  }

  saveCollection() {
    if (this.collectionForm.invalid) return;
    const c = this.collection();
    if (!c) return;

    const updated = {
      ...c,
      name: this.collectionForm.value.name!,
      description: this.collectionForm.value.description!,
      theme: this.collectionForm.value.theme!,
    };

    this.isEditing.set(false);

    this.store.dispatch(updateCollection({ collection: updated }));

    const selectedIds = this.selectedBookIds.value;
    selectedIds.forEach((id) => {
      const book = this.books().find((item) => item.id === id);
      if (!book) return;
      this.store.dispatch(updateBook({ book: { ...book, collectionId: updated.id } }));
    });
    this.selectedBookIds.setValue([]);
  }

}
