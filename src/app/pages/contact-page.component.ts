import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [FormsModule],
  template: `
    <main class="max-w-3xl mx-auto px-4 py-16">
      <div class="text-center mb-10">
        <h1 class="text-4xl font-serif font-bold text-gray-900">Get in touch</h1>
        <p class="mt-3 text-gray-600">Questions about an order or a product? We are here to help.</p>
      </div>
      <form class="space-y-5" (ngSubmit)="submitted = true">
        <label class="block text-sm font-medium text-gray-700">Name<input name="name" required [(ngModel)]="name" class="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"></label>
        <label class="block text-sm font-medium text-gray-700">Email<input name="email" type="email" required [(ngModel)]="email" class="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"></label>
        <label class="block text-sm font-medium text-gray-700">Message<textarea name="message" required [(ngModel)]="message" rows="5" class="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"></textarea></label>
        <button type="submit" class="rounded-lg bg-pink-500 px-6 py-3 font-semibold text-white hover:bg-pink-600">Send message</button>
        @if (submitted) { <p class="text-sm text-green-600">Thanks, {{ name }}. We will be in touch soon.</p> }
      </form>
    </main>
  `
})
export class ContactPageComponent {
  name = '';
  email = '';
  message = '';
  submitted = false;
}