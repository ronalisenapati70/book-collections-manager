import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { createBook } from '../../store/books.actions';
import { loadCollections } from '../../../collections/store/collections.actions';
import { selectAllCollections } from '../../../collections/store/collections.selectors';
import { BookFormComponent } from '../../components/book-form/book-form.component';

@Component({
  selector: 'app-book-new',
  standalone: true,
  imports: [CommonModule, RouterLink, BookFormComponent],
  templateUrl: './book-new.component.html',
  styleUrl: './book-new.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookNewComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);

  collections = toSignal(this.store.select(selectAllCollections), { initialValue: [] });

  bookForm = new FormGroup({
    collectionId: new FormControl<number | null>(null),
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    author: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    rating: new FormControl<number>(5, { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
  });

  ngOnInit(): void {
    this.store.dispatch(loadCollections());

    // Preselect collectionId when coming from collection detail via query param
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((qp) => {
      const collectionId = qp.get('collectionId');
      if (collectionId) {
        this.bookForm.controls.collectionId.setValue(Number(collectionId));
      }
    });
  }

  saveBook() {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    const value = this.bookForm.getRawValue();

    const createPayload = {
      collectionId:
        value.collectionId === null || value.collectionId === undefined
          ? null
          : Number(value.collectionId),
      title: value.title,
      author: value.author,
      rating: Number(value.rating),
      description: value.description,
    };

    this.store.dispatch(createBook({ book: createPayload }));
    this.router.navigateByUrl('/books');
  }
}
