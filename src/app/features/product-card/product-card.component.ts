import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-card bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <!-- Image Container -->
      <div class="relative overflow-hidden bg-gray-100 h-64">
        <img 
          [src]="product.image" 
          [alt]="product.name"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        >
        
        <!-- Badge -->
        <div *ngIf="product.badge" 
          class="absolute top-3 right-3 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {{ product.badge }}
        </div>

        <!-- Hover Actions -->
        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          <button 
            (click)="onAddToCart()"
            class="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full font-semibold transition-colors">
            Add to Cart
          </button>
          <button 
            (click)="onAddToWishlist()"
            class="bg-white hover:bg-gray-100 text-pink-500 p-2 rounded-full transition-colors">
            <span class="text-xl">♡</span>
          </button>
        </div>
      </div>

      <!-- Product Info -->
      <div class="p-4">
        <h3 class="text-gray-800 font-semibold text-sm mb-1">{{ product.name }}</h3>
        <p class="text-gray-600 text-xs mb-3 line-clamp-2">{{ product.description }}</p>
        
        <!-- Rating -->
        <div class="flex items-center gap-2 mb-3">
          <div class="flex text-yellow-400">
            <span *ngFor="let i of [1,2,3,4,5]" [class.text-gray-300]="i > Math.ceil(product.rating)">★</span>
          </div>
          <span class="text-gray-600 text-xs">({{ product.reviewCount }})</span>
        </div>

        <!-- Price -->
        <div class="flex items-center gap-2">
          <span class="text-pink-500 font-bold text-lg">\${{ product.price }}</span>
          <span *ngIf="product.originalPrice" class="text-gray-400 line-through text-sm">\${{ product.originalPrice }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .product-card {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() addToWishlist = new EventEmitter<Product>();

  Math = Math;

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }

  onAddToWishlist(): void {
    this.addToWishlist.emit(this.product);
  }
}
