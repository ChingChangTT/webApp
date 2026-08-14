import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, Category, CATEGORIES } from '../models';
import { MOCK_PRODUCTS } from '../../shared/data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>(MOCK_PRODUCTS);
  private selectedCategorySubject = new BehaviorSubject<Category>(CATEGORIES[0]);
  private filteredProductsSubject = new BehaviorSubject<Product[]>(MOCK_PRODUCTS);
  private cartSubject = new BehaviorSubject<Product[]>([]);
  private wishlistSubject = new BehaviorSubject<Product[]>([]);

  // Public observables
  public products$: Observable<Product[]> = this.productsSubject.asObservable();
  public selectedCategory$: Observable<Category> = this.selectedCategorySubject.asObservable();
  public filteredProducts$: Observable<Product[]> = this.filteredProductsSubject.asObservable();
  public cart$: Observable<Product[]> = this.cartSubject.asObservable();
  public wishlist$: Observable<Product[]> = this.wishlistSubject.asObservable();

  constructor() {
    this.filterProductsByCategory(CATEGORIES[0]);
  }

  // Get all products
  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  // Get single product by ID
  getProductById(id: string): Product | undefined {
    return this.productsSubject.value.find(p => p.id === id);
  }

  // Filter products by category
  filterProductsByCategory(category: Category): void {
    this.selectedCategorySubject.next(category);
    
    const filtered = category.slug === 'all'
      ? this.productsSubject.value
      : this.productsSubject.value.filter(p => p.category.slug === category.slug);
    
    this.filteredProductsSubject.next(filtered);
  }

  // Get available categories
  getCategories(): Category[] {
    return CATEGORIES;
  }

  // Add to cart
  addToCart(product: Product): void {
    const currentCart = this.cartSubject.value;
    const existingProduct = currentCart.find(p => p.id === product.id);
    
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    } else {
      currentCart.push({ ...product, quantity: 1 });
    }
    
    this.cartSubject.next([...currentCart]);
  }

  // Remove from cart
  removeFromCart(productId: string): void {
    const updatedCart = this.cartSubject.value.filter(p => p.id !== productId);
    this.cartSubject.next(updatedCart);
  }

  // Add to wishlist
  addToWishlist(product: Product): void {
    const currentWishlist = this.wishlistSubject.value;
    
    if (!currentWishlist.find(p => p.id === product.id)) {
      this.wishlistSubject.next([...currentWishlist, product]);
    }
  }

  // Remove from wishlist
  removeFromWishlist(productId: string): void {
    const updatedWishlist = this.wishlistSubject.value.filter(p => p.id !== productId);
    this.wishlistSubject.next(updatedWishlist);
  }

  // Get cart items count
  getCartCount(): Observable<number> {
    return this.cart$.pipe(map(items => items.length));
  }

  // Get wishlist items count
  getWishlistCount(): Observable<number> {
    return this.wishlist$.pipe(map(items => items.length));
  }
}
