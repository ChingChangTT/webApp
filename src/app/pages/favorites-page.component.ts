import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../core/services';
import { DuplicateItemDialogComponent } from '../shared/components/duplicate-item-dialog.component';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  template: `
    <section class="favorites-view min-h-[60vh] bg-pink-50">
      <div class="favorites-inner">
        <h1 class="text-3xl font-bold text-gray-900">Favorite items</h1>
        <p class="favorites-subtitle text-gray-600">Products you saved for later.</p>

        @if (productService.wishlist$ | async; as products) {
          @if (products.length) {
            <div class="favorites-grid">
              @for (product of products; track product.id) {
                <article class="favorite-card overflow-hidden rounded-xl bg-white shadow-md">
                  <img [src]="product.image" [alt]="product.name" class="favorite-image" />
                  <div class="favorite-body">
                    <h2 class="text-lg font-semibold text-gray-900">{{ product.name }}</h2>
                    <p class="mt-2 font-bold text-pink-500">\${{ product.price }}</p>
                    <div class="favorite-actions flex">
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
  `,
  styles: [`
    .favorites-view { padding: 2rem; }
    .favorites-inner { width: 100%; }
    .favorites-subtitle { margin-top: 0.5rem; margin-bottom: 2rem; }
    .favorites-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.5rem; }
    .favorite-card { display: flex; flex-direction: column; }
    .favorite-image { display: block; width: 100%; height: 14rem; object-fit: cover; }
    .favorite-body { padding: 1.25rem; }
    .favorite-actions { gap: 0.75rem; margin-top: 1rem; flex-wrap: wrap; }
    @media (max-width: 900px) { .favorites-grid { grid-template-columns: 1fr; } }
    @media (max-width: 640px) { .favorites-view { padding: 1.25rem; } }
  `]
})
export class FavoritesPageComponent {
  constructor(public productService: ProductService, private dialog: MatDialog) {}

  moveToCart(product: Parameters<ProductService['addToCart']>[0]): void {
    if (!this.productService.addToCart(product)) {
      this.dialog.open(DuplicateItemDialogComponent, {
        width: 'min(90vw, 420px)',
        maxWidth: '90vw',
        data: { productName: product.name, destination: 'cart' }
      });
    }
  }
}
