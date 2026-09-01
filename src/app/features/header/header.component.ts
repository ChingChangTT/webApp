import { Component, inject, OnInit, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs/operators';
import { ProductService } from '../../core/services';
import { Product } from '../../core/models';
import { UserStore } from '../../core/store/user-store';
import { MatDialog } from '@angular/material/dialog';
import { AccountItemsDialogComponent, AccountItemsDialogMode } from './account-items-dialog.component';
import { MatIcon } from "@angular/material/icon";
import { MaterialModule } from '../../../lib/material.module';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AsyncPipe, RouterLink, RouterLinkActive, MatIcon, MaterialModule],
  template: `
    <header class="sticky top-0 z-50 bg-white shadow-md">
      <!-- Top Bar -->
      <div class="bg-linear-to-r from-pink-50 to-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 py-2 text-center text-sm text-gray-600">
          Free Delivery on Orders Over \$50 | Use Code: BEAUTI20 for 20% Off
        </div>
      </div>

      <!-- Main Header -->
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between gap-5">
          <!-- Logo -->
          <div class="shrink-0">
            <h1 class="text-3xl font-serif font-bold text-gray-900">
              <span class="text-pink-500">BEAUTIFO</span>
            </h1>
          </div>

          <!-- Search Bar -->
          <mat-form-field appearance="outline" subscriptSizing="dynamic" class="filter-field">
            <mat-label>Search</mat-label>
            <mat-icon matPrefix>search</mat-icon>
            <input
              matInput
              #searchInput
              [value]="searchQuery()"
              placeholder="Search products..."
              (input)="onSearch($event)"
              [matAutocomplete]="searchResults"
            />
            @if (searchQuery()) {
              <button
                matIconSuffix
                mat-icon-button
                aria-label="Clear search"
                class="clear-button"
                (click)="clearSearch(searchInput)"
                type="button">
                <mat-icon>close</mat-icon>
              </button>
            }
          </mat-form-field>
          <mat-autocomplete
            #searchResults="matAutocomplete"
            [displayWith]="displayProductName"
            (optionSelected)="selectSearchProduct($event.option.value)"
          >
            @if (searchQuery()) {
              @for (product of filteredProducts$ | async; track product.id) {
                <mat-option [value]="product">
                  <div class="flex items-center gap-3 py-2">
                    <img
                      [src]="product.image"
                      [alt]="product.name"
                      class="h-10 w-10 rounded object-cover"
                    />
                    <span>
                      <strong class="block">{{ product.name }}</strong>
                      <small class="text-gray-500">\${{ product.price }}</small>
                    </span>
                  </div>
                </mat-option>
              } @empty {
                <mat-option disabled>No products match your search.</mat-option>
              }
            }
          </mat-autocomplete>
          <!-- Actions -->
          <div class="flex items-center gap-6">
            <button
              type="button"
              (click)="openAccountItems('favorites')"
              aria-label="View favorite items"
              class="search-icon-button relative appearance-none bg-transparent border-none p-0 cursor-pointer text-gray-700 hover:text-pink-500 transition-colors">
              <span class="text-2xl">♡</span>
              @if(wishlistCount$ | async; as count){
                @if(count > 0){
                  <span class="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {{ count }}
                  </span>
                }
              }
            </button>

            <button
              type="button"
              (click)="openAccountItems('cart')"
              aria-label="View cart"
              class="search-icon-button relative appearance-none bg-transparent border-none p-0 cursor-pointer text-gray-700 hover:text-pink-500 transition-colors">
              <span class="text-2xl">🛒</span>
              @if(cartCount$ | async; as count){
                @if(count > 0){
                  <span class="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {{ count }}
                  </span>
                }
              }
            </button>

            <div
              class="relative"
              (mouseenter)="isHoverTrue.set(true)"
              (mouseleave)="isHoverTrue.set(false)"
            >
              <button
                type="button"
                (click)="profileNavigation()"
                class="search-icon-button text-gray-700 hover:text-pink-500 transition-colors"
                aria-label="Open profile"
              >
                <span class="text-2xl">👤</span>
              </button>

              @if (isHoverTrue() && isLoggedIn()) {
                <div class="absolute left-1/2 top-full -translate-x-1/2 pt-3 z-50">
                  <div class="w-52 rounded-xl border border-pink-100 bg-white p-2 shadow-xl">
                    <div class="px-3 py-2 border-b border-gray-100">
                      <p class="mt-0.5 text-sm font-semibold text-gray-800">{{userStore.userProfile()?.email}}</p>
                    </div>
                    <!-- <a routerLink="/profile" class="mt-1 flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-pink-50">
                      <span>👤 Profile</span>
                    </a>
                    <a routerLink="/favorites" class="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-pink-50">
                      <span>♡ Favorites</span>
                      <span class="text-xs text-pink-500">{{ wishlistCount$ | async }}</span>
                    </a>
                    <a routerLink="/cart" class="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-pink-50">
                      <span>🛒 Cart</span>
                      <span class="text-xs text-pink-500">{{ cartCount$ | async }}</span>
                    </a> -->
                    <button
                      type="button"
                      (click)="logout()"
                      class="logout-button mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                      aria-label="Log out of your account"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Log out
                    </button>
                  </div>
                </div>
              }
            </div>

          </div>
        </div>

        <!-- Mobile Search -->
        <div class="md:hidden mt-4">
          <input 
            type="text" 
            placeholder="Search..." 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="border-t border-gray-200">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex gap-8">
            <a routerLink="/" routerLinkActive="text-pink-500" [routerLinkActiveOptions]="{ exact: true }" class="py-3 text-gray-700 font-medium hover:text-pink-500 transition-colors">
              Home
            </a>
            <a routerLink="/shop" routerLinkActive="text-pink-500" class="py-3 text-gray-700 font-medium hover:text-pink-500 transition-colors">
              Shop
            </a>
            <a routerLink="/categories" routerLinkActive="text-pink-500" class="py-3 text-gray-700 font-medium hover:text-pink-500 transition-colors">
              Categories
            </a>
            <a routerLink="/about" routerLinkActive="text-pink-500" class="py-3 text-gray-700 font-medium hover:text-pink-500 transition-colors">
              About Us
            </a>
            <a routerLink="/contact" routerLinkActive="text-pink-500" class="py-3 text-gray-700 font-medium hover:text-pink-500 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </nav>
    </header>
  `,
  styleUrls: ['./header-style.scss']
})
export class HeaderComponent implements OnInit {
  cartCount$ = this.productService.cart$.pipe(map(items => items.length));
  wishlistCount$ = this.productService.wishlist$.pipe(map(items => items.length));
  filteredProducts$ = this.productService.searchResults$;
  protected isHoverTrue=signal<boolean>(false);
  protected userStore=inject(UserStore);
  searchQuery = signal('');
  constructor(private productService: ProductService,
    private routes:Router,
    private dialog: MatDialog) {}

  ngOnInit(): void {
    
  }

  profileNavigation(): Promise<boolean> {
    return this.routes.navigate([this.isLoggedIn() ? '/account/profile' : '/sign-in']);
  }

  openAccountItems(mode: AccountItemsDialogMode): void {
    if (!this.isLoggedIn()) {
      this.routes.navigate(['/sign-in']);
      return;
    }

    this.dialog.open(AccountItemsDialogComponent, {
      width: 'min(92vw, 620px)',
      maxWidth: '92vw',
      data: { mode }
    });
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  onSearch(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.searchQuery.set(input);
    this.productService.setSearchQuery(input);
  }

  displayProductName(product: Product | string): string {
    return typeof product === 'string' ? product : product?.name ?? '';
  }

  selectSearchProduct(product: Product): void {
    this.routes.navigate(['/shop'], {
      queryParams: { product: product.id }
    });
  }
  clearSearch(input: HTMLInputElement): void {
    input.value = '';
    this.searchQuery.set('');
    this.productService.setSearchQuery('');
    input.focus();
  }
  logout(): Promise<boolean> {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.isHoverTrue.set(false);

    return this.routes.navigate(['/sign-in']);
  }
}
