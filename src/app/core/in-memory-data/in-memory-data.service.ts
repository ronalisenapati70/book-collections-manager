import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const collections = [
      {
        id: 1,
        name: 'Productivity',
        description: 'Work smarter, not harder.',
        theme: 'indigo', // ✅ FIXED
        createdAt: new Date('2025-01-01').toISOString(),
      },
      {
        id: 2,
        name: 'Fiction',
        description: 'Stories to unwind.',
        theme: 'emerald', // ✅ FIXED
        createdAt: new Date('2025-02-10').toISOString(),
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
    ];

    return { collections, books };
  }

  // Ensures each POST gets a new ID
  getNextId(items: { id: number }[]): number {
    return items.length === 0 ? 1 : Math.max(...items.map((item) => item.id)) + 1;
  }
}
