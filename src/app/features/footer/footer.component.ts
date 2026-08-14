import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-gray-900 text-gray-300">
      <!-- Main Footer Content -->
      <div class="max-w-7xl mx-auto px-4 py-16">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          <!-- Brand Column -->
          <div class="space-y-4">
            <h3 class="text-2xl font-serif font-bold text-white">BEAUTIFO</h3>
            <p class="text-sm leading-relaxed">
              Discover natural beauty products crafted with care and certified organic ingredients.
            </p>
            <div class="flex gap-4">
              <a href="#" class="hover:text-pink-500 transition-colors">f</a>
              <a href="#" class="hover:text-pink-500 transition-colors">𝕏</a>
              <a href="#" class="hover:text-pink-500 transition-colors">📷</a>
              <a href="#" class="hover:text-pink-500 transition-colors">in</a>
            </div>
          </div>

          <!-- Shop Column -->
          <div>
            <h4 class="text-white font-semibold mb-4">Shop</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-pink-500 transition-colors">All Products</a></li>
              <li><a href="#" class="hover:text-pink-500 transition-colors">For Face</a></li>
              <li><a href="#" class="hover:text-pink-500 transition-colors">For Body</a></li>
              <li><a href="#" class="hover:text-pink-500 transition-colors">For Hair</a></li>
              <li><a href="#" class="hover:text-pink-500 transition-colors">Sale</a></li>
            </ul>
          </div>

          <!-- Company Column -->
          <div>
            <h4 class="text-white font-semibold mb-4">Company</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-pink-500 transition-colors">About Us</a></li>
              <li><a href="#" class="hover:text-pink-500 transition-colors">Our Story</a></li>
              <li><a href="#" class="hover:text-pink-500 transition-colors">Sustainability</a></li>
              <li><a href="#" class="hover:text-pink-500 transition-colors">Blog</a></li>
              <li><a href="#" class="hover:text-pink-500 transition-colors">Careers</a></li>
            </ul>
          </div>

          <!-- Support Column -->
          <div>
            <h4 class="text-white font-semibold mb-4">Support</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-pink-500 transition-colors">Contact Us</a></li>
              <li><a href="#" class="hover:text-pink-500 transition-colors">FAQs</a></li>
              <li><a href="#" class="hover:text-pink-500 transition-colors">Shipping Info</a></li>
              <li><a href="#" class="hover:text-pink-500 transition-colors">Returns</a></li>
              <li><a href="#" class="hover:text-pink-500 transition-colors">Track Order</a></li>
            </ul>
          </div>

          <!-- Legal Column -->
          <div>
            <h4 class="text-white font-semibold mb-4">Legal</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-pink-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" class="hover:text-pink-500 transition-colors">Terms of Service</a></li>
              <li><a href="#" class="hover:text-pink-500 transition-colors">Cookie Policy</a></li>
              <li><a href="#" class="hover:text-pink-500 transition-colors">Accessibility</a></li>
            </ul>
          </div>
        </div>

        <!-- Value Propositions -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-gray-700">
          <div class="flex items-center gap-4">
            <span class="text-3xl">🎁</span>
            <div>
              <h5 class="font-semibold text-white">Free Deluxe Samples</h5>
              <p class="text-sm text-gray-400">With every order</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-3xl">⭐</span>
            <div>
              <h5 class="font-semibold text-white">Earn Reward Points</h5>
              <p class="text-sm text-gray-400">On every purchase</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-3xl">🚚</span>
            <div>
              <h5 class="font-semibold text-white">Free Delivery</h5>
              <p class="text-sm text-gray-400">On orders over \$50</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div class="border-t border-gray-700">
        <div class="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-sm text-gray-400">
            © 2024 BEAUTIFO. All rights reserved.
          </p>
          <div class="flex gap-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Visa.svg" alt="Visa" class="h-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MC_logo.svg" alt="Mastercard" class="h-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" class="h-6">
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class FooterComponent {}
