import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { map, take } from 'rxjs/operators';
import { ProductService } from '../core/services';
import { CheckoutDialogComponent } from '../shared/components/checkout-dialog.component';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  template: `
    <section class="cart-view min-h-[60vh] bg-pink-50">
      <div class="cart-inner">
        <h1 class="text-3xl font-bold text-gray-900">Your cart</h1>
        <p class="cart-subtitle text-gray-600">Items you have added to your cart.</p>

        @if (productService.cart$ | async; as products) {
          @if (products.length) {
            <div class="overflow-hidden rounded-xl bg-white shadow-md">
              @for (product of products; track product.id) {
                <article class="cart-row flex items-center border-b border-gray-100">
                  <img [src]="product.image" [alt]="product.name" class="cart-image rounded-lg" />
                  <div class="flex-1">
                    <h2 class="font-semibold text-gray-900">{{ product.name }}</h2>
                    <p class="text-sm text-gray-500">Quantity: {{ product.quantity || 1 }}</p>
                    <p class="font-bold text-pink-500">\${{ product.price * (product.quantity || 1) }}</p>
                  </div>
                  <button type="button" (click)="productService.removeFromCart(product.id)" class="rounded-lg border border-gray-300 px-4 py-2 text-gray-700">Remove</button>
                </article>
              }
              <div class="cart-summary flex items-center justify-between">
                <div class="text-lg font-bold">
                  <span>Total: </span><span class="text-pink-500">\${{ total$ | async }}</span>
                </div>
                <button type="button" (click)="openCheckout()" class="rounded-lg bg-pink-500 px-6 py-3 font-semibold text-white hover:bg-pink-600">
                  Proceed to payment
                </button>
              </div>
            </div>
          } @else {
            <div class="rounded-xl bg-white p-10 text-center shadow-sm">
              <p class="text-gray-600">Your cart is empty.</p>
              <a routerLink="/shop" class="mt-4 inline-block font-semibold text-pink-500">Start shopping</a>
            </div>
          }
        }
      </div>
    </section>
  `,
  styles: [`
    .cart-view { padding: 2rem; }
    .cart-inner { width: 100%; }
    .cart-subtitle { margin-top: 0.5rem; margin-bottom: 2rem; }
    .cart-row { gap: 1rem; padding: 1rem; }
    .cart-image { display: block; width: 5rem; height: 5rem; flex: 0 0 5rem; object-fit: cover; }
    .cart-summary { gap: 1rem; padding: 1.25rem; }
    @media (max-width: 640px) {
      .cart-view { padding: 1.25rem; }
      .cart-row { align-items: flex-start; flex-wrap: wrap; }
      .cart-summary { align-items: stretch; flex-direction: column; }
    }
  `]
})
export class CartPageComponent {
  readonly total$ = this.productService.cart$.pipe(
    map(products => products.reduce(
      (total, product) => total + product.price * (product.quantity || 1),
      0
    ).toFixed(2))
  );

  constructor(public productService: ProductService, private dialog: MatDialog) {}

  openCheckout(): void {
    this.total$.pipe(take(1)).subscribe(total => {
      this.dialog.open(CheckoutDialogComponent, {
        width: 'min(92vw, 520px)',
        maxWidth: '92vw',
        maxHeight: 'calc(100dvh - 2rem)',
        data: { total }
      });
    });
  }
}
