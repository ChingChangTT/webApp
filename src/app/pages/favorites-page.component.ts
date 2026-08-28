import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../core/services';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  template: `
    <section class="min-h-[60vh] bg-pink-50 py-12">
      <div class="max-w-7xl mx-auto px-4">
        <h1 class="text-3xl font-bold text-gray-900">Favorite items</h1>
        <p class="mt-2 mb-8 text-gray-600">Products you saved for later.</p>

        @if (productService.wishlist$ | async; as products) {
          @if (products.length) {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (product of products; track product.id) {
                <article class="overflow-hidden rounded-xl bg-white shadow-md">
                  <img [src]="product.image" [alt]="product.name" class="h-56 w-full object-cover" />
                  <div class="p-5">
                    <h2 class="text-lg font-semibold text-gray-900">{{ product.name }}</h2>
                    <p class="mt-2 font-bold text-pink-500">\${{ product.price }}</p>
                    <div class="mt-4 flex gap-3">
                      <button type="button" (click)="moveToCart(product)" class="rounded-lg bg-pink-500 px-4 py-2 text-white">Add to cart</button>
                      <button type="button" (click)="productService.removeFromWishlist(product.id)" class="rounded-lg border border-gray-300 px-4 py-2 text-gray-700">Remove</button>
                    </div>
                  </div>
                </article>
              }
            </div>
          } @else {
            <div class="rounded-xl bg-white p-10 text-center shadow-sm">
              <p class="text-gray-600">You have no favorite items yet.</p>
              <a routerLink="/shop" class="mt-4 inline-block font-semibold text-pink-500">Browse products</a>
            </div>
          }
        }
      </div>
    </section>
  `
})
export class FavoritesPageComponent {
  constructor(public productService: ProductService) {}

  moveToCart(product: Parameters<ProductService['addToCart']>[0]): void {
    this.productService.addToCart(product);
    this.productService.removeFromWishlist(product.id);
  }
}
