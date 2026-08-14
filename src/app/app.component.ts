import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  HeaderComponent, 
  HeroSectionComponent, 
  ProductGridComponent, 
  NewsletterComponent, 
  FooterComponent 
} from '../app/features';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeroSectionComponent,
    ProductGridComponent,
    NewsletterComponent,
    FooterComponent
  ],
  template: `
    <app-header></app-header>
    <app-hero-section></app-hero-section>
    <app-product-grid></app-product-grid>
    <app-newsletter></app-newsletter>
    <app-footer></app-footer>
  `,
  styles: []
})
export class AppComponent {}
