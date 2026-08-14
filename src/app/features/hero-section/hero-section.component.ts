import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero-section relative overflow-hidden bg-gradient-to-r from-pink-50 to-white py-20">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Left Content -->
          <div class="space-y-6">
            <div class="text-sm font-semibold text-pink-500 uppercase tracking-wider">
              Welcome to BEAUTIFO
            </div>
            
            <h1 class="text-4xl lg:text-5xl font-serif font-bold text-gray-900 leading-tight">
              Natural Beauty <span class="text-pink-500">Redefined</span>
            </h1>

            <p class="text-lg text-gray-600 leading-relaxed">
              Discover our curated collection of premium, organic skincare and beauty products. 
              Crafted with nature's finest ingredients to reveal your most radiant self.
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-wrap gap-4">
              <button class="px-8 py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors duration-300 shadow-lg hover:shadow-xl">
                Shop Collection
              </button>
              <button class="px-8 py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-300">
                Learn More
              </button>
            </div>

            <!-- Trust Badges -->
            <div class="flex items-center gap-6 pt-4">
              <div class="flex items-center gap-2">
                <span class="text-2xl">✓</span>
                <span class="text-sm text-gray-600">100% Natural</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-2xl">✓</span>
                <span class="text-sm text-gray-600">Cruelty-Free</span>
              </div>
            </div>
          </div>

          <!-- Right Image -->
          <div class="relative h-96 lg:h-full">
            <div class="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-100 rounded-3xl"></div>
            <img 
              src="https://i.pinimg.com/736x/07/9a/16/079a161ed785efc26d2451d8fd3d3451.jpg" 
              alt="Beauty Products"
              class="relative rounded-3xl w-full h-full object-cover shadow-xl"
            >
          </div>
        </div>
      </div>

      <!-- Decorative Elements -->
      <div class="absolute top-10 right-20 w-20 h-20 bg-pink-200 rounded-full opacity-30 blur-2xl"></div>
      <div class="absolute bottom-20 left-20 w-32 h-32 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
    </section>
  `,
  styles: [`
    .hero-section {
      min-height: 500px;
    }
  `]
})
export class HeroSectionComponent {}
