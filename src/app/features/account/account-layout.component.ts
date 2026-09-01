import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserStore } from '../../core/store/user-store';

@Component({
  selector: 'app-account-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <section class="bg-gray-50 py-12">
      <div class="account-layout mx-auto w-[94%] max-w-7xl">
        <aside class="account-sidebar rounded-xl bg-white p-4 shadow-md">
          <p class="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-gray-400">My account</p>
          <nav class="account-nav flex flex-col">
            <a routerLink="/account/profile" routerLinkActive="active-account-link" class="account-link rounded-lg px-3 py-3 font-semibold text-gray-700">👤 My profile</a>
            <a routerLink="/account/favorites" routerLinkActive="active-account-link" class="account-link rounded-lg px-3 py-3 font-semibold text-gray-700">♡ Favorite items</a>
            <a routerLink="/account/cart" routerLinkActive="active-account-link" class="account-link rounded-lg px-3 py-3 font-semibold text-gray-700">🛒 My cart</a>
            <button type="button" (click)="logout()" class="mt-3 rounded-lg px-3 py-3 text-left font-semibold text-red-600 hover:bg-red-50">Log out</button>
          </nav>
        </aside>
        <main class="account-content min-w-0 overflow-hidden rounded-xl bg-white shadow-md">
          <router-outlet></router-outlet>
        </main>
      </div>
    </section>
  `,
  styles: [`
    .account-layout { display: grid; grid-template-columns: 260px minmax(0, 1fr); align-items: start; gap: 1.5rem; }
    .account-sidebar { position: sticky; top: 9rem; width: 100%; }
    .account-content { width: 100%; }
    .account-nav { gap: 0.5rem; }
    .account-link:hover, .active-account-link { color: #db2777; background: #fdf2f8; }
    @media (max-width: 768px) {
      .account-layout { grid-template-columns: 1fr; }
      .account-sidebar { position: static; }
    }
  `]
})
export class AccountLayoutComponent {
  private readonly router = inject(Router);
  private readonly userStore = inject(UserStore);

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.userStore.loadUser();
    this.router.navigate(['/sign-in']);
  }
}
