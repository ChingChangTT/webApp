import { AsyncPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DeliveryOrder, DeliveryStatus, OrderService } from '../core/services';

@Component({
  selector: 'app-order-tracking-page',
  standalone: true,
  imports: [AsyncPipe, DatePipe, RouterLink],
  template: `
    <section class="min-h-[70vh] bg-pink-50 py-10">
      <div class="mx-auto max-w-5xl px-4">
        @if (orderService.currentOrder$ | async; as order) {
          <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p class="text-sm font-semibold uppercase tracking-wider text-pink-500">Order {{ order.id }}</p>
              <h1 class="mt-1 text-3xl font-bold text-gray-900">Track your delivery</h1>
              <p class="mt-2 text-gray-600">Estimated arrival: {{ order.estimatedArrival | date:'EEEE, MMM d' }}</p>
            </div>
            @if (order.status !== 'delivered') {
              <button type="button" (click)="orderService.advanceDemoStatus()" class="rounded-lg border border-pink-500 px-4 py-2 text-sm font-semibold text-pink-500">
                Advance demo status
              </button>
            }
          </div>

          <div class="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
            <div class="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div class="relative h-[390px] overflow-hidden bg-[#f5f1e8]" style="background-image: linear-gradient(32deg, transparent 46%, rgba(255,255,255,.9) 47%, rgba(255,255,255,.9) 53%, transparent 54%), linear-gradient(118deg, transparent 46%, rgba(255,255,255,.8) 47%, rgba(255,255,255,.8) 53%, transparent 54%); background-size: 120px 100px, 170px 150px;">
                <div class="absolute left-[12%] top-[68%] h-4 w-4 rounded-full border-4 border-white bg-gray-800 shadow"></div>
                <div class="absolute bottom-[29%] left-[14%] h-1 w-[70%] origin-left -rotate-[22deg] rounded-full bg-pink-400"></div>
                <div class="absolute right-[12%] top-[28%] flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-pink-500 text-lg text-white shadow">⌂</div>
                <div class="absolute z-10 flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-gray-900 text-xl text-white shadow-lg transition-all duration-700"
                     [style.left.%]="courierPosition(order.status).left"
                     [style.top.%]="courierPosition(order.status).top">
                  🚚
                </div>
                <div class="absolute bottom-4 left-4 rounded-lg bg-white/95 px-3 py-2 text-xs font-medium text-gray-700 shadow">
                  {{ statusMessage(order.status) }}
                </div>
                <div class="absolute right-3 top-3 rounded-md bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">Simulated location</div>
              </div>
            </div>

            <aside class="rounded-2xl bg-white p-6 shadow-sm">
              <h2 class="text-xl font-semibold text-gray-900">Delivery progress</h2>
              <ol class="mt-6 space-y-0">
                @for (step of steps; track step.status; let last = $last) {
                  <li class="flex gap-4">
                    <div class="flex flex-col items-center">
                      <div class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                           [class.bg-pink-500]="isComplete(order.status, step.status)"
                           [class.text-white]="isComplete(order.status, step.status)"
                           [class.bg-gray-200]="!isComplete(order.status, step.status)"
                           [class.text-gray-500]="!isComplete(order.status, step.status)">
                        {{ isComplete(order.status, step.status) ? '✓' : '•' }}
                      </div>
                      @if (!last) {
                        <div class="h-12 w-0.5" [class.bg-pink-500]="isComplete(order.status, nextStatus(step.status))" [class.bg-gray-200]="!isComplete(order.status, nextStatus(step.status))"></div>
                      }
                    </div>
                    <div class="pb-6">
                      <p class="font-semibold text-gray-900">{{ step.label }}</p>
                      <p class="text-sm text-gray-500">{{ step.description }}</p>
                    </div>
                  </li>
                }
              </ol>

              <div class="mt-2 border-t border-gray-100 pt-5">
                <p class="mb-2 text-sm text-gray-600">
                  {{ order.paymentMethod === 'cash-on-delivery' ? 'Cash on Delivery' : 'Paid by card' }} · {{ order.deliveryArea }}
                </p>
                <p class="mb-2 text-sm text-gray-600">Delivery contact: {{ order.fullName }} · {{ order.phoneNumber }}</p>
                <p class="text-sm text-gray-500">{{ order.items.length }} item(s) · Total</p>
                <p class="text-lg font-bold text-pink-500">\${{ order.total.toFixed(2) }}</p>
              </div>
            </aside>
          </div>
        } @else {
          <div class="rounded-2xl bg-white p-12 text-center shadow-sm">
            <h1 class="text-2xl font-bold text-gray-900">No delivery to track</h1>
            <p class="mt-2 text-gray-600">Complete a checkout to create an order.</p>
            <a routerLink="/shop" class="mt-5 inline-block rounded-lg bg-pink-500 px-5 py-2.5 font-semibold text-white">Shop now</a>
          </div>
        }
      </div>
    </section>
  `
})
export class OrderTrackingPageComponent {
  readonly steps: { status: DeliveryStatus; label: string; description: string }[] = [
    { status: 'confirmed', label: 'Order confirmed', description: 'Payment received and order prepared.' },
    { status: 'shipped', label: 'Shipped', description: 'Your package has left the warehouse.' },
    { status: 'out-for-delivery', label: 'Out for delivery', description: 'The courier is heading to your address.' },
    { status: 'delivered', label: 'Delivered', description: 'Your package has arrived.' }
  ];

  constructor(public orderService: OrderService) {}

  isComplete(current: DeliveryStatus, step: DeliveryStatus): boolean {
    return this.statusIndex(current) >= this.statusIndex(step);
  }

  nextStatus(status: DeliveryStatus): DeliveryStatus {
    const statuses = this.steps.map(step => step.status);
    return statuses[Math.min(statuses.indexOf(status) + 1, statuses.length - 1)];
  }

  courierPosition(status: DeliveryStatus): { left: number; top: number } {
    const positions = {
      confirmed: { left: 10, top: 64 },
      shipped: { left: 33, top: 54 },
      'out-for-delivery': { left: 58, top: 42 },
      delivered: { left: 79, top: 25 }
    };
    return positions[status];
  }

  statusMessage(status: DeliveryStatus): string {
    return this.steps.find(step => step.status === status)?.description ?? '';
  }

  private statusIndex(status: DeliveryStatus): number {
    return this.steps.findIndex(step => step.status === status);
  }
}
