import { Component } from '@angular/core';
import { ProductGridComponent } from '../features';

@Component({
  selector: 'app-shop-page',
  standalone: true,
  imports: [ProductGridComponent],
  template: `
    <section class="bg-pink-50 py-16 text-center">
      <h1 class="text-4xl font-serif font-bold text-gray-900">Shop BEAUTIFO</h1>
      <p class="mt-3 text-gray-600">Thoughtful beauty essentials for your everyday ritual.</p>
    </section>
    <app-product-grid></app-product-grid>
  `
})
export class ShopPageComponent {}