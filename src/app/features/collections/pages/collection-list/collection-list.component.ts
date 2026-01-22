import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { ConfirmModalComponent } from '../../../../shared/ui/confirm-modal/confirm-modal.component';
import { CollectionModel } from '../../models/collections.model';
import { loadCollections, deleteCollection } from '../../store/collections.actions';
import { loadBooks } from '../../../books/store/books.actions';
import { selectAllCollections, selectCollectionsError } from '../../store/collections.selectors';
import { selectAllBooks, selectBooksError } from '../../../books/store/books.selectors';

@Component({
  selector: 'app-collection-list',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, ConfirmModalComponent],
  templateUrl: './collection-list.component.html',
  styleUrl: './collection-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionListComponent implements OnInit {
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);

  collections = toSignal(this.store.select(selectAllCollections), { initialValue: [] });
  collectionsError = toSignal(this.store.select(selectCollectionsError), { initialValue: null });
  private books = toSignal(this.store.select(selectAllBooks), { initialValue: [] });
  booksError = toSignal(this.store.select(selectBooksError), { initialValue: null });

  itemToDelete = signal<CollectionModel | null>(null);

  filterControl = new FormControl('', { nonNullable: true });
  filterQuery = signal('');

  ngOnInit(): void {
    this.store.dispatch(loadCollections());
    this.store.dispatch(loadBooks());

    this.filterControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => this.filterQuery.set(val));
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
