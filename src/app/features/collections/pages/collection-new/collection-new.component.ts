import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { createCollection } from '../../store/collections.actions';
import {
  COLLECTION_THEME_COLORS,
  CollectionThemeColor,
} from '../../../../shared/constants/color-themes';

@Component({
  selector: 'app-collection-new',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './collection-new.component.html',
  styleUrl: './collection-new.component.scss',
})
export class CollectionNewComponent {
  private router = inject(Router);
  private store = inject(Store);
  collectionForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
  readonly colors = COLLECTION_THEME_COLORS;
  selectedColor = signal<CollectionThemeColor>('indigo');

  trackByColor(_index: number, color: string) {
    return color;
  }

  createCollection() {
    if (this.collectionForm.invalid) return;
    const newCollection = {
      name: this.collectionForm.value.name!,
      description: this.collectionForm.value.description!,
      theme: this.selectedColor(),
      createdAt: new Date().toISOString(),
    };

    this.store.dispatch(createCollection({ collection: newCollection }));
    this.router.navigateByUrl('/collections');
  }
}
