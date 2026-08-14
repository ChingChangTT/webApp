import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="py-16 bg-gradient-to-r from-pink-100 to-pink-50">
      <div class="max-w-4xl mx-auto px-4">
        <div class="text-center space-y-6">
          <!-- Title -->
          <h2 class="text-3xl font-serif font-bold text-gray-900">
            Join Our Beauty Community
          </h2>

          <!-- Description -->
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Subscribe to get exclusive deals, early access to new products, and beauty tips delivered to your inbox.
          </p>

          <!-- Newsletter Form -->
          <form (ngSubmit)="onSubmit()" class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              [(ngModel)]="email"
              name="email"
              placeholder="Enter your email" 
              required
              class="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
            <button 
              type="submit"
              class="px-8 py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors duration-300 whitespace-nowrap">
              Subscribe
            </button>
          </form>

          <!-- Confirmation Message -->
          <p *ngIf="submitted" class="text-green-600 font-medium animate-pulse">
            ✓ Thank you for subscribing!
          </p>

          <!-- Privacy Note -->
          <p class="text-sm text-gray-500">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-pulse {
      animation: fadeIn 0.3s ease-in-out;
    }
  `]
})
export class NewsletterComponent {
  email = '';
  submitted = false;

  onSubmit(): void {
    if (this.email) {
      console.log('Newsletter subscription:', this.email);
      this.submitted = true;
      this.email = '';
      
      setTimeout(() => {
        this.submitted = false;
      }, 3000);
    }
  }
}
