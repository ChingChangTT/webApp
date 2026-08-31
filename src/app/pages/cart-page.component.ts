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
    <section class="min-h-[60vh] bg-pink-50 py-12">
      <div class="max-w-4xl mx-auto px-4">
        <h1 class="text-3xl font-bold text-gray-900">Your cart</h1>
        <p class="mt-2 mb-8 text-gray-600">Items you have added to your cart.</p>

        @if (productService.cart$ | async; as products) {
          @if (products.length) {
            <div class="overflow-hidden rounded-xl bg-white shadow-md">
              @for (product of products; track product.id) {
                <article class="flex items-center gap-4 border-b border-gray-100 p-4">
                  <img [src]="product.image" [alt]="product.name" class="h-20 w-20 rounded-lg object-cover" />
                  <div class="flex-1">
                    <h2 class="font-semibold text-gray-900">{{ product.name }}</h2>
                    <p class="text-sm text-gray-500">Quantity: {{ product.quantity || 1 }}</p>
                    <p class="font-bold text-pink-500">\${{ product.price * (product.quantity || 1) }}</p>
                  </div>
                  <button type="button" (click)="productService.removeFromCart(product.id)" class="rounded-lg border border-gray-300 px-4 py-2 text-gray-700">Remove</button>
                </article>
              }
              <div class="flex items-center justify-between gap-4 p-5">
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
  `
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
