import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { take } from 'rxjs';

import { createCollection, createCollectionSuccess } from '../../store/collections.actions';
import { loadBooks } from '../../../books/store/books.actions';
import { selectAllBooks } from '../../../books/store/books.selectors';
import {
  COLLECTION_THEME_COLORS,
  CollectionThemeColor,
} from '../../../../shared/constants/color-themes';
import { CollectionFormComponent } from '../../components/collection-form/collection-form.component';

@Component({
  selector: 'app-collection-new',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, CollectionFormComponent],
  templateUrl: './collection-new.component.html',
  styleUrl: './collection-new.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionNewComponent implements OnInit {
  private router = inject(Router);
  private store = inject(Store);
  private actions$ = inject(Actions);
  private destroyRef = inject(DestroyRef);

  books = toSignal(this.store.select(selectAllBooks), { initialValue: [] });
  unassignedBooks = computed(() =>
    this.books().filter((book) => book.collectionId === null),
  );

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
  selectedBookIds = new FormControl<number[]>([], { nonNullable: true });
  readonly colors = COLLECTION_THEME_COLORS;

  ngOnInit(): void {
    this.store.dispatch(loadBooks());
  }

  toggleBookSelection(id: number, checked: boolean) {
    const current = this.selectedBookIds.value;
    this.selectedBookIds.setValue(
      checked ? [...current, id] : current.filter((bookId) => bookId !== id),
    );
  }

  createCollection() {
    if (this.collectionForm.invalid) return;
    const newCollection = {
      name: this.collectionForm.value.name!,
      description: this.collectionForm.value.description!,
      theme: this.collectionForm.value.theme!,
    };

    this.store.dispatch(
      createCollection({
        collection: newCollection,
        selectedBookIds: this.selectedBookIds.value,
      }),
    );
    this.actions$
      .pipe(ofType(createCollectionSuccess), take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.router.navigateByUrl('/collections');
      });
  }
}
