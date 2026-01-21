import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LibraryApiService } from '../../../../core/api/library-api.service';

@Component({
  selector: 'app-collection-new',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './collection-new.component.html',
  styleUrl: './collection-new.component.scss',
})
export class CollectionNewComponent {
  private router = inject(Router);
  private api = inject(LibraryApiService);
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
      id: 0,
      name: this.collectionForm.value.name!,
      description: this.collectionForm.value.description!,
      theme: this.selectedColor(),
      createdAt: new Date().toISOString(),
    };

    this.api.createCollection(newCollection).subscribe(() => {
      this.router.navigateByUrl('/collections');
    });
  }
}
