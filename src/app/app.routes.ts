import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'BEAUTIFO | Natural Beauty',
    loadComponent: () => import('./pages/home-page.component').then(m => m.HomePageComponent)
  },
  {
    path: 'shop',
    title: 'Shop | BEAUTIFO',
    loadComponent: () => import('./pages/shop-page.component').then(m => m.ShopPageComponent)
  },
  {
    path: 'categories',
    title: 'Categories | BEAUTIFO',
    loadComponent: () => import('./pages/categories-page.component').then(m => m.CategoriesPageComponent)
  },
  {
    path: 'about',
    title: 'About Us | BEAUTIFO',
    loadComponent: () => import('./pages/about-page.component').then(m => m.AboutPageComponent)
  },
  {
    path: 'contact',
    title: 'Contact | BEAUTIFO',
    loadComponent: () => import('./pages/contact-page.component').then(m => m.ContactPageComponent)
  },
  {
    path: 'sign-in',
    title: 'Sign In | BEAUTIFO',
    loadComponent: () => import('./features/sign-in/sign-in').then(m => m.SignIn)
  },
  {
    path: 'profile',
    title: 'Profile | BEAUTIFO',
    loadComponent: () => import('./features/profile/profile').then(m => m.Profile)
  },
  {
    path: 'favorites',
    title: 'Favorites | BEAUTIFO',
    loadComponent: () => import('./pages/favorites-page.component').then(m => m.FavoritesPageComponent)
  },
  {
    path: 'cart',
    title: 'Cart | BEAUTIFO',
    loadComponent: () => import('./pages/cart-page.component').then(m => m.CartPageComponent)
  },
  {
    path: 'order-tracking',
    title: 'Track Order | BEAUTIFO',
    loadComponent: () => import('./pages/order-tracking-page.component').then(m => m.OrderTrackingPageComponent)
  },
  { path: '**', redirectTo: '' }
];
