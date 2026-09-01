import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../lib/material.module';
import { OrderService, ProductService } from '../../core/services';
import { Router } from '@angular/router';
import { GoogleMapPickerComponent, MapAddressSelection } from './google-map-picker.component';

@Component({
  selector: 'app-checkout-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, GoogleMapPickerComponent],
  template: `
    <div class="flex max-h-[calc(100dvh-2rem)] w-full flex-col gap-4 overflow-y-auto overscroll-contain p-4 sm:p-6">
      @if (paid()) {
        <div class="py-5 text-center">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <mat-icon>check_circle</mat-icon>
          </div>
          <h2 class="mt-4 text-2xl font-semibold text-gray-900">Order confirmed</h2>
          <p class="mt-2 text-gray-600">Your demo order is ready for delivery tracking.</p>
          <button type="button" (click)="trackDelivery()" class="mt-6 rounded-lg bg-pink-500 px-6 py-2.5 font-semibold text-white">
            Track delivery
          </button>
        </div>
      } @else {
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-2xl font-semibold text-gray-900">Checkout</h2>
            <p class="mt-1 text-sm text-gray-500">Demo payment—no real charge will be made.</p>
          </div>
          <button mat-icon-button type="button" aria-label="Close checkout" (click)="dialogRef.close()">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <div class="my-5 flex items-center justify-between rounded-xl bg-pink-50 p-4">
          <span class="font-medium text-gray-700">Order total</span>
          <strong class="text-xl text-pink-500">\${{ data.total }}</strong>
        </div>

        <form [formGroup]="paymentForm" (ngSubmit)="pay()" class="flex flex-col">
          <label class="block text-sm font-medium text-gray-700 py-4">
            Delivery area
            <select formControlName="deliveryArea" (change)="onDeliveryAreaChange()" class="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-pink-500">
              <option value="">Select your area</option>
              <option value="Phnom Penh">Phnom Penh</option>
              <option value="Outside Phnom Penh">Outside Phnom Penh</option>
            </select>
            @if ((showErrors() || paymentForm.controls.deliveryArea.touched) && paymentForm.controls.deliveryArea.invalid) {
              <span class="mt-1 block text-xs font-normal text-red-600">Please select Phnom Penh or Outside Phnom Penh so we can show the available delivery and payment options.</span>
            }
          </label>
          <label class="block text-sm font-medium text-gray-700 py-4">
            Full name
            <input formControlName="fullName" autocomplete="name" placeholder="Your full name" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-pink-500" />
            @if ((showErrors() || paymentForm.controls.fullName.touched) && paymentForm.controls.fullName.invalid) {
              <span class="mt-1 block text-xs font-normal text-red-600">Enter the recipient's full name using at least 2 characters.</span>
            }
          </label>
          <label class="block text-sm font-medium text-gray-700 py-4">
            Phone number
            <input type="tel" formControlName="phoneNumber" inputmode="tel" autocomplete="tel" placeholder="e.g. 012 345 678" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-pink-500" />
            @if ((showErrors() || paymentForm.controls.phoneNumber.touched) && paymentForm.controls.phoneNumber.invalid) {
              <span class="mt-1 block text-xs font-normal text-red-600">Enter a valid phone number with 8–15 digits so the courier can contact you. Spaces and hyphens are allowed.</span>
            }
          </label>
          <label class="block text-sm font-medium text-gray-700 py-4">
            Email
            <input type="email" formControlName="email" autocomplete="email" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-pink-500" />
            @if ((showErrors() || paymentForm.controls.email.touched) && paymentForm.controls.email.invalid) {
              <span class="mt-1 block text-xs font-normal text-red-600">Enter a complete email address, for example name@example.com.</span>
            }
          </label>
          <label class="block text-sm font-medium text-gray-700 py-4">
            Delivery address
            <textarea formControlName="deliveryAddress" rows="2" autocomplete="street-address" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-pink-500"></textarea>
            @if ((showErrors() || paymentForm.controls.deliveryAddress.touched) && paymentForm.controls.deliveryAddress.invalid) {
              <span class="mt-1 block text-xs font-normal text-red-600">Enter a detailed delivery address with at least 5 characters, or select it from the map below.</span>
            }
          </label>
          <button type="button" (click)="toggleMap()" class="self-start rounded-lg border border-pink-500 px-4 py-2 text-sm font-semibold text-pink-500">
            {{ showMap() ? 'Hide Google Map' : 'Select address from Google Map' }}
          </button>
          @if (showMap()) {
            <div #mapSection class="mt-6 mb-6">
              <app-google-map-picker (addressSelected)="useMapAddress($event)" />
            </div>
          }
 
          <div class="rounded-xl border border-gray-200 p-4 mt-6">
            <p class="text-sm font-semibold text-gray-800">Payment method</p>
            <label class="mt-3 flex cursor-pointer items-center gap-3 text-sm text-gray-700">
              <input type="radio" formControlName="paymentMethod" value="card" (change)="updateCardValidation()" />
              Pay by card
            </label>
            @if (isPhnomPenh) {
              <label class="mt-3 flex cursor-pointer items-center gap-3 text-sm text-gray-700">
                <input type="radio" formControlName="paymentMethod" value="cash-on-delivery" (change)="updateCardValidation()" />
                Cash on Delivery
              </label>
            }
          </div>

          @if (paymentForm.controls.paymentMethod.value === 'card') {
            <label class="block text-sm font-medium text-gray-700 py-4">
              Card number
              <input formControlName="cardNumber" inputmode="numeric" maxlength="19" autocomplete="cc-number" placeholder="4242 4242 4242 4242" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-pink-500" />
              @if ((showErrors() || paymentForm.controls.cardNumber.touched) && paymentForm.controls.cardNumber.invalid) {
                <span class="mt-1 block text-xs font-normal text-red-600">Enter all 16 card digits. You may include spaces or hyphens.</span>
              }
            </label>
            <div class="grid grid-cols-2 gap-4">
              <label class="block text-sm font-medium text-gray-700">
                Expiry
                <input formControlName="expiry" inputmode="numeric" maxlength="5" autocomplete="cc-exp" placeholder="MM/YY" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-pink-500" />
                @if ((showErrors() || paymentForm.controls.expiry.touched) && paymentForm.controls.expiry.invalid) {
                  <span class="mt-1 block text-xs font-normal text-red-600">Use MM/YY, for example 12/30.</span>
                }
              </label>
              <label class="block text-sm font-medium text-gray-700">
                CVC
                <input type="password" formControlName="cvc" inputmode="numeric" maxlength="4" autocomplete="cc-csc" placeholder="123" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-pink-500" />
                @if ((showErrors() || paymentForm.controls.cvc.touched) && paymentForm.controls.cvc.invalid) {
                  <span class="mt-1 block text-xs font-normal text-red-600">Enter the 3- or 4-digit security code printed on your card.</span>
                }
              </label>
            </div>
          }

          @if (showErrors() && paymentForm.invalid) {
            <p class="rounded-lg bg-red-50 p-3 text-sm text-red-700">Some information needs your attention. Review the red guidance under each field, correct it, and try again.</p>
          }

          <div class="mt-6">
            <button type="submit" class="w-full rounded-lg bg-pink-500 px-5 py-3 font-semibold text-white hover:bg-pink-600">
              {{ paymentForm.controls.paymentMethod.value === 'cash-on-delivery' ? 'Place cash order' : 'Pay $' + data.total }}
            </button>
          </div>
        </form>
      }
    </div>
  `
})
export class CheckoutDialogComponent {
  @ViewChild('mapSection') private mapSection?: ElementRef<HTMLElement>;
  readonly data = inject<{ total: string }>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<CheckoutDialogComponent>);
  private readonly productService = inject(ProductService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  readonly paid = signal(false);
  readonly showErrors = signal(false);
  readonly showMap = signal(false);

  readonly paymentForm = this.formBuilder.nonNullable.group({
    deliveryArea: ['', Validators.required],
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^[+]?[0-9][0-9\s-]{7,14}$/)]],
    email: ['', [Validators.required, Validators.email]],
    deliveryAddress: ['', [Validators.required, Validators.minLength(5)]],
    deliveryLatitude: [null as number | null],
    deliveryLongitude: [null as number | null],
    paymentMethod: ['card' as 'card' | 'cash-on-delivery', Validators.required],
    cardNumber: ['', [Validators.required, Validators.pattern(/^(?:\d[ -]?){15}\d$/)]],
    expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
    cvc: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
  });

  get isPhnomPenh(): boolean {
    return this.paymentForm.controls.deliveryArea.value === 'Phnom Penh';
  }

  toggleMap(): void {
    if (this.showMap()) {
      this.showMap.set(false);
      return;
    }

    this.showMap.set(true);
    setTimeout(() => {
      this.mapSection?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  useMapAddress(selection: MapAddressSelection): void {
    this.paymentForm.patchValue({
      deliveryLatitude: selection.latitude,
      deliveryLongitude: selection.longitude
    });
    if (selection.address) {
      this.paymentForm.controls.deliveryAddress.setValue(selection.address);
      this.paymentForm.controls.deliveryAddress.markAsTouched();
    }
  }

  onDeliveryAreaChange(): void {
    if (!this.isPhnomPenh && this.paymentForm.controls.paymentMethod.value === 'cash-on-delivery') {
      this.paymentForm.controls.paymentMethod.setValue('card');
    }
    this.updateCardValidation();
  }

  updateCardValidation(): void {
    const cardControls = [
      this.paymentForm.controls.cardNumber,
      this.paymentForm.controls.expiry,
      this.paymentForm.controls.cvc
    ];

    if (this.paymentForm.controls.paymentMethod.value === 'card') {
      this.paymentForm.controls.cardNumber.setValidators([Validators.required, Validators.pattern(/^(?:\d[ -]?){15}\d$/)]);
      this.paymentForm.controls.expiry.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]);
      this.paymentForm.controls.cvc.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]);
    } else {
      cardControls.forEach(control => control.clearValidators());
    }
    cardControls.forEach(control => control.updateValueAndValidity());
  }

  pay(): void {
    this.showErrors.set(true);
    if (this.paymentForm.controls.paymentMethod.value === 'cash-on-delivery' && !this.isPhnomPenh) {
      this.paymentForm.controls.paymentMethod.setValue('card');
      this.updateCardValidation();
      return;
    }
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.orderService.createOrder(
      this.productService.getCartItems(),
      Number(this.data.total),
      this.paymentForm.controls.fullName.value,
      this.paymentForm.controls.phoneNumber.value,
      this.paymentForm.controls.email.value,
      this.paymentForm.controls.deliveryAddress.value,
      this.paymentForm.controls.deliveryArea.value,
      this.paymentForm.controls.paymentMethod.value,
      this.paymentForm.controls.deliveryLatitude.value,
      this.paymentForm.controls.deliveryLongitude.value
    );
    this.productService.clearCart();
    this.paymentForm.reset();
    this.paid.set(true);
  }

  trackDelivery(): void {
    this.dialogRef.close(true);
    this.router.navigate(['/order-tracking']);
  }
}
