import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, Category, CATEGORIES } from '../models';
import { MOCK_PRODUCTS } from '../../shared/data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly cartStorageKey = 'beautifo-cart';
  private readonly wishlistStorageKey = 'beautifo-wishlist';
  private productsSubject = new BehaviorSubject<Product[]>(MOCK_PRODUCTS);
  private selectedCategorySubject = new BehaviorSubject<Category>(CATEGORIES[0]);
  private filteredProductsSubject = new BehaviorSubject<Product[]>(MOCK_PRODUCTS);
  private searchResultsSubject = new BehaviorSubject<Product[]>([]);
  private cartSubject = new BehaviorSubject<Product[]>(this.readStoredProducts(this.cartStorageKey));
  private wishlistSubject = new BehaviorSubject<Product[]>(this.readStoredProducts(this.wishlistStorageKey));
  private searchQuerySubject =new BehaviorSubject<string>('');
  // Public observables
  public products$: Observable<Product[]> = this.productsSubject.asObservable();
  public selectedCategory$: Observable<Category> = this.selectedCategorySubject.asObservable();
  public filteredProducts$: Observable<Product[]> = this.filteredProductsSubject.asObservable();
  public searchResults$: Observable<Product[]> = this.searchResultsSubject.asObservable();
  public cart$: Observable<Product[]> = this.cartSubject.asObservable();
  public wishlist$: Observable<Product[]> = this.wishlistSubject.asObservable();

  constructor() {
    this.filterProductsByCategory(CATEGORIES[0]);
  }

  private readStoredProducts(key: string): Product[] {
    try {
      return JSON.parse(localStorage.getItem(key) ?? '[]') as Product[];
    } catch {
      localStorage.removeItem(key);
      return [];
    }
  }

  private saveProducts(key: string, products: Product[]): void {
    localStorage.setItem(key, JSON.stringify(products));
  }

  // Get all products
  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  // Get single product by ID
  getProductById(id: string): Product | undefined {
    return this.productsSubject.value.find(p => p.id === id);
  }
  
  setSearchQuery(query: string): void {
    this.searchQuerySubject.next(query.trim().toLocaleLowerCase());
    this.updateSearchResults();
  }

  private updateSearchResults(): void {
    const query = this.searchQuerySubject.value;
    if (!query) {
      this.searchResultsSubject.next([]);
      return;
    }

    const matchingProducts = this.productsSubject.value.filter(product =>
      product.name.toLocaleLowerCase().includes(query)
    );
    const exactMatches = matchingProducts.filter(product =>
      product.name.toLocaleLowerCase() === query
    );

    if (exactMatches.length) {
      this.searchResultsSubject.next(exactMatches);
      return;
    }

    matchingProducts.sort((first, second) => {
      const firstStartsWith = first.name.toLocaleLowerCase().startsWith(query) ? 0 : 1;
      const secondStartsWith = second.name.toLocaleLowerCase().startsWith(query) ? 0 : 1;
      return firstStartsWith - secondStartsWith || first.name.localeCompare(second.name);
    });
    this.searchResultsSubject.next(matchingProducts);
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
  addToCart(product: Product): boolean {
    const currentCart = this.cartSubject.value;
    const existingProduct = currentCart.find(p => p.id === product.id);

    if (existingProduct) {
      return false;
    }

    const updatedCart = [...currentCart, { ...product, quantity: 1 }];
    this.cartSubject.next(updatedCart);
    this.saveProducts(this.cartStorageKey, updatedCart);
    return true;
  }

  // Remove from cart
  removeFromCart(productId: string): void {
    const updatedCart = this.cartSubject.value.filter(p => p.id !== productId);
    this.cartSubject.next(updatedCart);
    this.saveProducts(this.cartStorageKey, updatedCart);
  }

  clearCart(): void {
    this.cartSubject.next([]);
    this.saveProducts(this.cartStorageKey, []);
  }

  getCartItems(): Product[] {
    return this.cartSubject.value.map(product => ({ ...product }));
  }

  // Add to wishlist
  addToWishlist(product: Product): boolean {
    const currentWishlist = this.wishlistSubject.value;

    if (currentWishlist.find(p => p.id === product.id)) {
      return false;
    }

    const updatedWishlist = [...currentWishlist, product];
    this.wishlistSubject.next(updatedWishlist);
    this.saveProducts(this.wishlistStorageKey, updatedWishlist);
    return true;
  }

  // Remove from wishlist
  removeFromWishlist(productId: string): void {
    const updatedWishlist = this.wishlistSubject.value.filter(p => p.id !== productId);
    this.wishlistSubject.next(updatedWishlist);
    this.saveProducts(this.wishlistStorageKey, updatedWishlist);
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
