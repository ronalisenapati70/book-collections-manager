import { BookModel } from '../../features/books/models/books.model';
import { CollectionModel } from '../../features/collections/models/collections.model';

export const MOCK_BOOKS: BookModel[] = [
  {
    id: 1,
    collectionId: 1,
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'Practical strategies for building good habits.',
    rating: 5,
  },
  {
    id: 2,
    collectionId: 1,
    title: 'Deep Work',
    author: 'Cal Newport',
    description: 'Focus strategies for meaningful output.',
    rating: 4,
  },
  {
    id: 3,
    collectionId: 2,
    title: 'Dune',
    author: 'Frank Herbert',
    description: 'Epic sci-fi classic with politics and ecology.',
    rating: 5,
  },
];

export const MOCK_COLLECTIONS: CollectionModel[] = [
  {
    id: 1,
    name: 'Productivity',
    description: 'Work smarter, not harder.',
    createdAt: '2024-06-01T00:00:00.000Z',
    theme: 'indigo',
  },
  {
    id: 2,
    name: 'Fiction',
    description: 'Stories to unwind.',
    createdAt: '2024-06-01T00:00:00.000Z',
    theme: 'emerald',
  },
  {
    id: 3,
    name: 'Tech & Architecture',
    description: 'Engineering craft + system design.',
    createdAt: '2024-06-01T00:00:00.000Z',
    theme: 'rose',
  },
];
