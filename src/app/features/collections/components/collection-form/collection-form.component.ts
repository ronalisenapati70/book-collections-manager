import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { BookModel } from '../../../books/models/books.model';
import { CollectionThemeColor } from '../../../../shared/constants/color-themes';

@Component({
  selector: 'app-collection-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './collection-form.component.html',
  styleUrl: './collection-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionFormComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() colors: readonly CollectionThemeColor[] = [];
  @Input() availableBooks: BookModel[] = [];
  @Input() selectedBookIds: number[] = [];
  @Input() submitLabel = 'Save Changes';
  @Input() cancelLabel = 'Cancel';
  @Input({ required: true }) cancelLink!: string;
  @Input() booksLabel = 'Add Books';
  @Input() emptyBooksText = 'No unassigned books available.';

  @Output() submitted = new EventEmitter<void>();
  @Output() toggleBook = new EventEmitter<{ id: number; checked: boolean }>();
  @Output() cancelled = new EventEmitter<void>();

  get themeControl(): FormControl<CollectionThemeColor> | null {
    return this.form.get('theme') as FormControl<CollectionThemeColor> | null;
  }

  trackByColor(_index: number, color: string): string {
    return color;
  }

  trackByBookId(_index: number, item: BookModel): number {
    return item.id;
  }
}
