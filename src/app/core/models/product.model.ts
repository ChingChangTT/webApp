import { Review } from './review.model';
import { Category } from './category.model';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: Category;
  badge?: string;
  rating: number;
  reviewCount: number;
  reviews?: Review[];
  inStock: boolean;
  quantity?: number;
  tags?: string[];
}
