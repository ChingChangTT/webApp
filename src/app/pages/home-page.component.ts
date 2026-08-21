import { Component } from '@angular/core';
import { HeroSectionComponent, ProductGridComponent, NewsletterComponent } from '../features';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [HeroSectionComponent, ProductGridComponent, NewsletterComponent],
  template: `
    <app-hero-section></app-hero-section>
    <app-product-grid></app-product-grid>
    <app-newsletter></app-newsletter>
  `
})
export class HomePageComponent {}