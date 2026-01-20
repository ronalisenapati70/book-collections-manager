import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-collection-new',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './collection-new.component.html',
  styleUrl: './collection-new.component.scss',
})
export class CollectionNewComponent {
  private router = inject(Router);
  collectionForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
  readonly colors = [
    'teal',
    'emerald',
    'rose',
    'amber',
    'cyan',
    'fuchsia',
    'indigo',
    'slate',
    'violet',
    'orange',
  ] as const;
  selectedColor = signal<(typeof this.colors)[number]>('indigo');

  trackByColor(_index: number, color: string) {
    return color;
  }

  createCollection() {
    if (this.collectionForm.invalid) return;
    const newCollection = {
      id: Date.now(), // temp ID until API/NgRx
      name: this.collectionForm.value.name!,
      description: this.collectionForm.value.description!,
      theme: this.selectedColor(),
      createdAt: new Date().toISOString(),
    };

    console.log('New collection (mock):', newCollection);

    // For now, just navigate back (later we’ll dispatch to store / API)
    this.router.navigateByUrl('/collections');
  }
}
