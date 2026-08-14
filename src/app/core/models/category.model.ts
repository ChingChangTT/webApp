export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export const CATEGORIES: Category[] = [
  { id: '1', name: 'All', slug: 'all' },
  { id: '2', name: 'For Face', slug: 'for-face' },
  { id: '3', name: 'For Body', slug: 'for-body' },
  { id: '4', name: 'For Hair', slug: 'for-hair' },
  { id: '5', name: 'Accessories', slug: 'accessories' }
];
