import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { MaterialModule } from '../../../lib/material.module';
import { Product } from '../../core/models';
import { ProductService } from '../../core/services';
import { DuplicateItemDialogComponent } from '../../shared/components/duplicate-item-dialog.component';
import { CheckoutDialogComponent } from '../../shared/components/checkout-dialog.component';

export type AccountItemsDialogMode = 'favorites' | 'cart';

@Component({
  selector: 'app-account-items-dialog',
  standalone: true,
  imports: [AsyncPipe, MaterialModule],
  template: `
    <div class="w-full bg-white p-4">
      <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">
            {{ data.mode === 'favorites' ? 'Favorite items' : 'Your cart' }}
          </h2>
          <p class="text-sm text-gray-500">
            {{ data.mode === 'favorites' ? 'Products you saved for later' : 'Items ready for checkout' }}
          </p>
        </div>
        <button mat-icon-button type="button" aria-label="Close" (click)="dialogRef.close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="max-h-[60vh] overflow-y-auto p-4">
        @if (items$ | async; as items) {
          @for (product of items; track product.id) {
            <article class="flex items-center gap-4 border-b border-gray-100 py-4 last:border-0">
              <img [src]="product.image" [alt]="product.name" class="h-16 w-16 rounded-lg object-cover" />
              <div class="min-w-0 flex-1">
                <h3 class="truncate text-sm font-semibold text-gray-900">{{ product.name }}</h3>
                @if (data.mode === 'cart') {
                  <p class="text-xs text-gray-500">Quantity: {{ product.quantity || 1 }}</p>
                }
                <p class="font-bold text-pink-500">
                  \${{ product.price * (data.mode === 'cart' ? (product.quantity || 1) : 1) }}
                </p>
              </div>

              <div class="flex flex-col gap-2">
                @if (data.mode === 'favorites') {
                  <button type="button" (click)="moveToCart(product)" class="btn rounded-lg bg-pink-500 px-3 py-1.5 text-xs font-semibold text-white">
                    Add to cart
                  </button>
                }
                <button type="button" (click)="remove(product.id)" class="btn rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-700">
                  Remove
                </button>
              </div>
            </article>
          } @empty {
            <div class="py-12 text-center text-gray-500">
              {{ data.mode === 'favorites' ? 'You have no favorite items yet.' : 'Your cart is empty.' }}
            </div>
          }
        }
      </div>

      <div class="flex items-center justify-between border-t border-gray-100 px-5 py-4">
        @if (data.mode === 'cart' && (items$ | async)?.length) {
          <strong>Total: <span class="text-pink-500">\${{ total$ | async }}</span></strong>
          <button type="button" (click)="openCheckout()" class="rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white">
            Pay now
          </button>
        } @else {
          <span></span>
        }
        <!-- <button type="button" (click)="openFullPage()" class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white">
          View full {{ data.mode === 'favorites' ? 'favorites' : 'cart' }}
        </button> -->
      </div>
    </div>
  `,
  styleUrls: ['./header-style.scss']
})
export class AccountItemsDialogComponent {
  readonly data = inject<{ mode: AccountItemsDialogMode }>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<AccountItemsDialogComponent>);
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  readonly items$ = this.data.mode === 'favorites'
    ? this.productService.wishlist$
    : this.productService.cart$;

  readonly total$ = this.productService.cart$.pipe(
    map(products => products.reduce(
      (total, product) => total + product.price * (product.quantity || 1),
      0
    ).toFixed(2))
  );

  moveToCart(product: Product): void {
    if (!this.productService.addToCart(product)) {
      this.dialog.open(DuplicateItemDialogComponent, {
        width: 'min(90vw, 420px)',
        maxWidth: '90vw',
        data: { productName: product.name, destination: 'cart' }
      });
    }
  }

  remove(productId: string): void {
    if (this.data.mode === 'favorites') {
      this.productService.removeFromWishlist(productId);
    } else {
      this.productService.removeFromCart(productId);
    }
  }

  openFullPage(): void {
    this.dialogRef.close();
    this.router.navigate([this.data.mode === 'favorites' ? '/account/favorites' : '/account/cart']);
  }

  openCheckout(): void {
    this.total$.pipe(take(1)).subscribe(total => {
      this.dialogRef.close();
      this.dialog.open(CheckoutDialogComponent, {
        width: 'min(92vw, 520px)',
        maxWidth: '92vw',
        maxHeight: 'calc(100dvh - 2rem)',
        data: { total }
      });
    });
  }
}
