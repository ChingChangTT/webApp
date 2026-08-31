import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../lib/material.module';

export interface DuplicateItemDialogData {
  productName: string;
  destination: 'cart' | 'favorites';
}

@Component({
  selector: 'app-duplicate-item-dialog',
  standalone: true,
  imports: [MaterialModule],
  template: `
    <div class="p-6">
      <div class="flex items-start gap-4">
        <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-500">
          <mat-icon>info</mat-icon>
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Item already added</h2>
          <p class="mt-2 text-sm text-gray-600">
            {{ data.productName }} is already in your {{ data.destination === 'cart' ? 'shopping cart' : 'favorite items' }}.
          </p>
        </div>
      </div>
      <div class="mt-6 flex justify-end">
        <button type="button" (click)="dialogRef.close()" class="w-13 rounded-lg bg-pink-500 px-5 py-2 text-sm font-semibold text-white">
          OK
        </button>
      </div>
    </div>
  `
})
export class DuplicateItemDialogComponent {
  readonly data = inject<DuplicateItemDialogData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<DuplicateItemDialogComponent>);
}
