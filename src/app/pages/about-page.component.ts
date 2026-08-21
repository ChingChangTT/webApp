import { Component } from '@angular/core';

@Component({
  selector: 'app-about-page',
  standalone: true,
  template: `
    <main class="max-w-4xl mx-auto px-4 py-16 text-center">
      <p class="text-sm font-semibold uppercase tracking-widest text-pink-500">Our story</p>
      <h1 class="mt-3 text-4xl font-serif font-bold text-gray-900">Beauty, made more thoughtful.</h1>
      <p class="mt-6 text-lg leading-relaxed text-gray-600">BEAUTIFO brings together effective, gentle formulas and the simple pleasure of a daily self-care ritual. We choose certified organic ingredients and work with care at every step.</p>
      <div class="mt-12 grid gap-8 text-left sm:grid-cols-3">
        <div><h2 class="font-semibold text-gray-900">Kind formulas</h2><p class="mt-2 text-sm text-gray-600">Ingredients selected for skin, body, and planet.</p></div>
        <div><h2 class="font-semibold text-gray-900">Small rituals</h2><p class="mt-2 text-sm text-gray-600">Products that make everyday care feel special.</p></div>
        <div><h2 class="font-semibold text-gray-900">Less waste</h2><p class="mt-2 text-sm text-gray-600">Packaging choices guided by a lighter footprint.</p></div>
      </div>
    </main>
  `
})
export class AboutPageComponent {}