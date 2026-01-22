import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CollectionModel } from '../../../collections/models/collections.model';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookFormComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() collections: CollectionModel[] = [];
  @Input() isEditMode = false;
  @Input() cancelLink = '/books';
  @Output() submitted = new EventEmitter<void>();

  trackByCollectionId(_index: number, item: CollectionModel): number {
    return item.id;
  }
}
