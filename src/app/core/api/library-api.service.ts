import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CollectionModel } from '../../features/collections/models/collections.model';
import { BookModel } from '../../features/books/models/books.model';

@Injectable({ providedIn: 'root' })
export class LibraryApiService {
  private readonly baseUrl = '/api';

  constructor(private http: HttpClient) {}

  // Collections
  getCollections(): Observable<CollectionModel[]> {
    return this.http.get<CollectionModel[]>(`${this.baseUrl}/collections`);
  }

  getCollection(id: number): Observable<CollectionModel> {
    return this.http.get<CollectionModel>(`${this.baseUrl}/collections/${id}`);
  }

  createCollection(collection: CollectionModel): Observable<CollectionModel> {
    return this.http.post<CollectionModel>(`${this.baseUrl}/collections`, collection);
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

  createBook(book: BookModel): Observable<BookModel> {
    return this.http.post<BookModel>(`${this.baseUrl}/books`, book);
  }

  updateBook(book: BookModel): Observable<BookModel> {
    return this.http.put<BookModel>(`${this.baseUrl}/books/${book.id}`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/books/${id}`);
  }
}
