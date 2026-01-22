import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BookModel } from '../../models/books.model';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookCardComponent {
  @Input({ required: true }) book!: BookModel;
  @Input({ required: true }) cardLink!: string | any[];
  @Input() theme = 'slate';
  @Input() collectionName?: string;
  @Input() collectionLink?: string | any[] | null;

  @Output() remove = new EventEmitter<BookModel>();

  get ratingLabel(): string {
    const r = Math.max(0, Math.min(5, this.book?.rating ?? 0));
    return `Rating: ${r}`;
  }

  onRemove(event: Event): void {
    event.stopPropagation();
    this.remove.emit(this.book);
  }
}
