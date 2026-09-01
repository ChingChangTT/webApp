import { Product, Banner, Category, CATEGORIES } from '../../core/models';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Luminous Glow Serum',
    description: 'Brightening serum with vitamin C complex for radiant skin',
    price: 48,
    originalPrice: 65,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop',
    category: CATEGORIES[1],
    badge: 'Sale',
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    tags: ['Brightening', 'Serum']
  },
  {
    id: '2',
    name: 'Rose Petal Face Mask',
    description: 'Hydrating mask with rose extracts for soft, supple skin',
    price: 32,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
    category: CATEGORIES[1],
    rating: 4.6,
    reviewCount: 89,
    inStock: true,
    tags: ['Hydrating', 'Mask']
  },
  {
    id: '3',
    name: 'Silk Body Cream',
    description: 'Luxurious body cream with shea butter and silk proteins',
    price: 42,
    image: 'https://hips.hearstapps.com/hmg-prod/images/hbz040124btyskincare-023-662818e57e78a.png?crop=1xw:1xh;center,top',
    category: CATEGORIES[2],
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    tags: ['Moisturizing', 'Body Care']
  },
  {
    id: '4',
    name: 'Detox Hair Mask',
    description: 'Cleansing hair mask for healthy, refreshed hair',
    price: 38,
    originalPrice: 52,
    image: 'https://hips.hearstapps.com/hmg-prod/images/drunk-elephant-skincare-65e9dba54d31a.jpg?crop=0.504xw:1.00xh;0.197xw,0&resize=1200:*',
    category: CATEGORIES[3],
    badge: 'New',
    rating: 4.5,
    reviewCount: 67,
    inStock: true,
    tags: ['Hair Care', 'Detox']
  },
  {
    id: '5',
    name: 'Bamboo Skincare Brush',
    description: 'Gentle facial brush with bamboo bristles for cleansing',
    price: 28,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
    category: CATEGORIES[4],
    rating: 4.4,
    reviewCount: 45,
    inStock: true,
    tags: ['Accessories', 'Tools']
  },
  {
    id: '6',
    name: 'Vitamin E Eye Cream',
    description: 'Nourishing eye cream for delicate under-eye area',
    price: 52,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
    category: CATEGORIES[1],
    rating: 4.9,
    reviewCount: 203,
    inStock: true,
    tags: ['Eye Care', 'Anti-Aging']
  },
  {
    id: '7',
    name: 'Argan Oil Hair Serum',
    description: 'Lightweight serum with argan oil for glossy hair',
    price: 35,
    image: 'https://www.palmolive.ph/content/dam/cp-sites-aem/personal-care/palmolive-eu/en_ph/images/hair-care/palmolive-ph-intensive-moisture-shampoo.jpg',
    category: CATEGORIES[3],
    rating: 4.6,
    reviewCount: 112,
    inStock: true,
    tags: ['Hair Care', 'Oil']
  },
  {
    id: '8',
    name: 'Rose Gold Face Roller',
    description: 'Jade roller with rose gold finish for facial massage',
    price: 24,
    image: 'https://s.yimg.com/lo/mysterio/api/5c5aa43e0bbe10871284a53b4ed729a400bf781067aade4e32395f0f8203837f/lightyear_networkapi/resizefill_w1080_h1080%3Bquality_80%3Bformat_webp/https%3A%2F%2Fmedia.zenfs.com%2Fen%2Fmarie_claire_us_340%2F7f34d8a1e479271be1057b74e5cc6325',
    category: CATEGORIES[4],
    rating: 4.3,
    reviewCount: 78,
    inStock: true,
    tags: ['Accessories', 'Tools']
  }
];

export const MOCK_BANNERS: Banner[] = [
  {
    id: '1',
    title: 'Natural Beauty Redefined',
    subtitle: 'Discover our curated collection of organic skincare',
    image: 'https://fashionista.com/.image/MTQ1NTI1MTYxMTQ2MTk3NTU5/drunk-elephant-main.jpg',
    cta: 'Shop Now',
    link: '/products',
    type: 'hero'
  },
  {
    id: '2',
    title: 'Natural Beauty Collection',
    subtitle: 'Pure ingredients for pure beauty',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=300&fit=crop',
    cta: 'Explore',
    link: '/collection/natural',
    type: 'secondary',
    position: 'left'
  },
  {
    id: '3',
    title: 'Luxury Hair Mask',
    subtitle: 'Transform your hair in minutes',
    image: 'https://fashionista.com/.image/MTQ1NTI1MTYxMTQ2MTk3NTU5/drunk-elephant-main.jpg',
    cta: 'Learn More',
    link: '/products/hair-mask',
    type: 'secondary',
    position: 'right'
  }
];
