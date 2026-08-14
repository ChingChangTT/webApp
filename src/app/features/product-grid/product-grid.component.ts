import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductService } from '../../core/services';
import { Product, Category, CATEGORIES } from '../../core/models';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    <section class="py-12 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Section Title -->
        <div class="text-center mb-8">
          <h2 class="text-3xl font-serif font-bold text-gray-800 mb-2">Featured Products</h2>
          <p class="text-gray-600">Discover our hand-picked selection of beauty essentials</p>
        </div>

        <!-- Category Filter Tabs -->
        <div class="flex flex-wrap justify-center gap-2 mb-8">
          <button 
            *ngFor="let category of categories"
            (click)="onCategoryChange(category)"
            [class.active]="(selectedCategory$ | async)?.id === category.id"
            class="px-6 py-2 rounded-full text-sm font-medium transition-all duration-300"
            [ngClass]="{
              'bg-pink-500 text-white': (selectedCategory$ | async)?.id === category.id,
              'bg-white text-gray-700 border border-gray-300 hover:border-pink-500': (selectedCategory$ | async)?.id !== category.id
            }">
            {{ category.name }}
          </button>
        </div>

        <!-- Products Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <app-product-card
            *ngFor="let product of (filteredProducts$ | async)"
            [product]="product"
            (addToCart)="onAddToCart($event)"
            (addToWishlist)="onAddToWishlist($event)">
          </app-product-card>
        </div>

        <!-- Empty State -->
        <div *ngIf="(filteredProducts$ | async)?.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">No products found in this category</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    button.active {
      box-shadow: 0 2px 8px rgba(236, 72, 153, 0.3);
    }
  `]
})
export class ProductGridComponent implements OnInit {
  categories: Category[] = [];
  selectedCategory$ = this.productService.selectedCategory$;
  filteredProducts$ = this.productService.filteredProducts$;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.categories = this.productService.getCategories();
  }

  onCategoryChange(category: Category): void {
    this.productService.filterProductsByCategory(category);
  }

  onAddToCart(product: Product): void {
    this.productService.addToCart(product);
    // Show toast notification (optional enhancement)
    console.log('Added to cart:', product.name);
  }

  onAddToWishlist(product: Product): void {
    this.productService.addToWishlist(product);
    console.log('Added to wishlist:', product.name);
  }
}
