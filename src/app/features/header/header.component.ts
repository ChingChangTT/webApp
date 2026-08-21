import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs/operators';
import { ProductService } from '../../core/services';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AsyncPipe, RouterLink, RouterLinkActive],
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
          <div class="hidden md:block flex-1 mx-8">
            <input 
              type="text" 
              placeholder="Search products, brands..." 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-6">
            <button class="search-icon-button relative appearance-none bg-transparent border-none p-0 cursor-pointer text-gray-700 hover:text-pink-500 transition-colors">
              <span class="text-2xl">🔍</span>
              <span class="sr-only">Search</span>
            </button>

            <button class="search-icon-button relative appearance-none bg-transparent border-none p-0 cursor-pointer text-gray-700 hover:text-pink-500 transition-colors">
              <span class="text-2xl">♡</span>
              @if(wishlistCount$ | async; as count){
                @if(count > 0){
                  <span class="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {{ count }}
                  </span>
                }
              }
            </button>

            <button class="search-icon-button relative appearance-none bg-transparent border-none p-0 cursor-pointer text-gray-700 hover:text-pink-500 transition-colors">
              <span class="text-2xl">🛒</span>
              @if(cartCount$ | async; as count){
                @if(count > 0){
                  <span class="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {{ count }}
                  </span>
                }
              }
            </button>

            <button (click)="profileNavigation()" class="search-icon-button appearance-none bg-transparent border-none p-0 cursor-pointer text-gray-700 hover:text-pink-500 transition-colors">
              <span class="text-2xl">👤</span>
            </button>
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

  constructor(private productService: ProductService,private routes:Router) {}

  ngOnInit(): void {}

  profileNavigation(): Promise<boolean> {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    return this.routes.navigate([isLoggedIn ? '/profile' : '/sign-in']);
  }
}
