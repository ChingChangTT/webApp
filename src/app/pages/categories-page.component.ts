import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORIES } from '../core/models';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="max-w-7xl mx-auto px-4 py-16">
      <div class="text-center mb-10">
        <h1 class="text-4xl font-serif font-bold text-gray-900">Browse Categories</h1>
        <p class="mt-3 text-gray-600">Find the right ritual for every part of your routine.</p>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        @for (category of categories.slice(1); track category.id) {
          <a routerLink="/shop" class="border border-gray-200 bg-white p-8 text-center hover:border-pink-500 hover:shadow-md transition-all">
            <span class="text-4xl">{{ category.icon || '✦' }}</span>
            <h2 class="mt-4 text-xl font-semibold text-gray-900">{{ category.name }}</h2>
            <span class="mt-2 inline-block text-sm text-pink-500">Shop now</span>
          </a>
        }
      </div>
    </main>
  `
})
export class CategoriesPageComponent {
  categories = CATEGORIES;
}