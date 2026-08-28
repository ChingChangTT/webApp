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
  private cartSubject = new BehaviorSubject<Product[]>(this.readStoredProducts(this.cartStorageKey));
  private wishlistSubject = new BehaviorSubject<Product[]>(this.readStoredProducts(this.wishlistStorageKey));
  private searchQuerySubject =new BehaviorSubject<string>('');
  // Public observables
  public products$: Observable<Product[]> = this.productsSubject.asObservable();
  public selectedCategory$: Observable<Category> = this.selectedCategorySubject.asObservable();
  public filteredProducts$: Observable<Product[]> = this.filteredProductsSubject.asObservable();
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
  
  setSearchQuery(query:string):void{
    this.searchQuerySubject.next(query.trim().toLocaleLowerCase());
    this.updateFilteredProducts();
  }

  private updateFilteredProducts(){
    const category=this.selectedCategorySubject.value;
    const query=this.searchQuerySubject.value;
    const filtered=this.productsSubject.value.filter(product=>{
      const matchesCategory=category.slug==='all' || product.category.slug === category.slug;
      const searchableText = [
        product.name,
        product.description,
        product.category.name,
        ...(product.tags ?? [])
      ].join(' ').toLowerCase();
      return matchesCategory && searchableText.includes(query);
    })
    this.filteredProductsSubject.next(filtered);
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
    
    const updatedCart = [...currentCart];
    this.cartSubject.next(updatedCart);
    this.saveProducts(this.cartStorageKey, updatedCart);
  }

  // Remove from cart
  removeFromCart(productId: string): void {
    const updatedCart = this.cartSubject.value.filter(p => p.id !== productId);
    this.cartSubject.next(updatedCart);
    this.saveProducts(this.cartStorageKey, updatedCart);
  }

  // Add to wishlist
  addToWishlist(product: Product): void {
    const currentWishlist = this.wishlistSubject.value;
    
    if (!currentWishlist.find(p => p.id === product.id)) {
      const updatedWishlist = [...currentWishlist, product];
      this.wishlistSubject.next(updatedWishlist);
      this.saveProducts(this.wishlistStorageKey, updatedWishlist);
    }
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
