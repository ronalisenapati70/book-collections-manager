import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CollectionModel } from '../../features/collections/models/collections.model';
import { BookModel } from '../../features/books/models/books.model';

export interface NewCollectionModel {
  name: string;
  description: string;
  theme: string;
}

export interface NewBookModel {
  collectionId: number | null;
  title: string;
  author: string;
  description: string;
  rating: number;
}

@Injectable({ providedIn: 'root' })
export class LibraryApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api';

  // Collections
  getCollections(): Observable<CollectionModel[]> {
    return this.http.get<CollectionModel[]>(`${this.baseUrl}/collections`);
  }

  getCollection(id: number): Observable<CollectionModel> {
    return this.http.get<CollectionModel>(`${this.baseUrl}/collections/${id}`);
  }

  createCollection(collection: NewCollectionModel): Observable<CollectionModel> {
    const payload = {
      ...collection,
      createdAt: new Date().toISOString(),
    };
    return this.http.post<CollectionModel>(`${this.baseUrl}/collections`, payload);
  }

  updateCollection(collection: CollectionModel): Observable<CollectionModel> {
    return this.http.put<CollectionModel>(
      `${this.baseUrl}/collections/${collection.id}`,
      collection,
    );
  }

  deleteCollection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/collections/${id}`);
  }

  // Books
  getBooks(): Observable<BookModel[]> {
    return this.http.get<BookModel[]>(`${this.baseUrl}/books`);
  }

  getBook(id: number): Observable<BookModel> {
    return this.http.get<BookModel>(`${this.baseUrl}/books/${id}`);
  }

  createBook(book: NewBookModel): Observable<BookModel> {
    return this.http.post<BookModel>(`${this.baseUrl}/books`, book);
  }

  updateBook(book: BookModel): Observable<BookModel> {
    return this.http.put<BookModel>(`${this.baseUrl}/books/${book.id}`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/books/${id}`);
  }
}
