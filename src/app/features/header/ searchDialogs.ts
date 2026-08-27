import { Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import { Product } from '../../core/models';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatCardModule, MatButtonModule,MatIconModule],
  template: `
     <div class="w-full max-w-lg rounded-lg bg-white p-4">
      <div class="mb-4 flex justify-between">
        <h2 class="text-lg font-semibold">Search results</h2>

        <button type="button" (click)="close()">✕</button>
      </div>

      @for (product of data.products; track product.id) {
        <button
          type="button"
          class="flex w-full items-center gap-3 p-3 text-left"
          (click)="selectProduct(product)"
        >
          <img
            [src]="product.image"
            [alt]="product.name"
            class="h-14 w-14 rounded object-cover"
          />

          <span>
            <strong class="block">{{ product.name }}</strong>
            <small>\${{ product.price }}</small>
          </span>
        </button>
      } @empty {
        <p>No products match your search.</p>
      }
    </div>
  `,
  styleUrls: ['./header-style.scss']
})
export class searchComponent implements OnInit {
  @Input() products: Product[] = [];
  @Input() open = false;

  @Output() productSelected = new EventEmitter<Product>();
  @Output() closed = new EventEmitter<void>();
  readonly data=inject<{ products: Product[]}>(MAT_DIALOG_DATA);
  private readonly dialoagRef=inject(MatDialogRef<searchComponent>)
  constructor(){}
  ngOnInit(): void {
    
  }
  close():void{
    this.dialoagRef.close();
  }
  selectProduct(product:Product):void{
    this.dialoagRef.close(product);
  }
}
