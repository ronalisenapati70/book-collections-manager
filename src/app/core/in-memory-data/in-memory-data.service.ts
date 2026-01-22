import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const collections = [
      {
        id: 1,
        name: 'Productivity',
        description: 'Work smarter, not harder.',
        theme: 'indigo',
        createdAt: new Date('2025-01-01').toISOString(),
      },
      {
        id: 2,
        name: 'Fiction',
        description: 'Stories to unwind.',
        theme: 'emerald',
        createdAt: new Date('2025-02-10').toISOString(),
      },
      {
        id: 3,
        name: 'Design',
        description: 'Craft, usability, and visual storytelling.',
        theme: 'rose',
        createdAt: new Date('2025-03-04').toISOString(),
      },
      {
        id: 4,
        name: 'Science',
        description: 'Curiosity-driven reads and discoveries.',
        theme: 'cyan',
        createdAt: new Date('2025-03-18').toISOString(),
      },
    ];

    const books = [
      {
        id: 1,
        collectionId: 1,
        title: 'Atomic Habits',
        author: 'James Clear',
        description: 'Practical strategies for building good habits.',
        rating: 5,
        createdAt: new Date('2025-01-05').toISOString(),
      },
      {
        id: 2,
        collectionId: 1,
        title: 'Deep Work',
        author: 'Cal Newport',
        description: 'Focus strategies for meaningful output.',
        rating: 4,
        createdAt: new Date('2025-01-08').toISOString(),
      },
      {
        id: 3,
        collectionId: 2,
        title: 'Dune',
        author: 'Frank Herbert',
        description: 'Epic sci-fi classic with politics and ecology.',
        rating: 5,
        createdAt: new Date('2025-02-12').toISOString(),
      },
      {
        id: 4,
        collectionId: 2,
        title: 'The Night Circus',
        author: 'Erin Morgenstern',
        description: 'A magical competition set within a wandering circus.',
        rating: 4,
        createdAt: new Date('2025-02-18').toISOString(),
      },
      {
        id: 5,
        collectionId: 3,
        title: 'The Design of Everyday Things',
        author: 'Don Norman',
        description: 'How good design shapes human behavior.',
        rating: 5,
        createdAt: new Date('2025-03-06').toISOString(),
      },
      {
        id: 6,
        collectionId: 3,
        title: 'Steal Like an Artist',
        author: 'Austin Kleon',
        description: 'Creative habits for finding inspiration.',
        rating: 4,
        createdAt: new Date('2025-03-08').toISOString(),
      },
      {
        id: 7,
        collectionId: 4,
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        description: 'A journey through modern cosmology.',
        rating: 4,
        createdAt: new Date('2025-03-20').toISOString(),
      },
      {
        id: 8,
        collectionId: 4,
        title: 'The Gene',
        author: 'Siddhartha Mukherjee',
        description: 'The history and science of genetic research.',
        rating: 5,
        createdAt: new Date('2025-03-22').toISOString(),
      },
    ];

    return { collections, books };
  }

  // Ensures each POST gets a new ID
  getNextId(items: { id: number }[]): number {
    return items.length === 0 ? 1 : Math.max(...items.map((item) => item.id)) + 1;
  }

  genId<T extends { id: number }>(items: T[]): number {
    return this.getNextId(items);
  }
}
