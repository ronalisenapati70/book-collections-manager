export interface BookModel {
  id: number;
  collectionId: number | null;
  title: string;
  author: string;
  description: string;
  rating: number;
}
