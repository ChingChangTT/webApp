import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-sign-in',
  styleUrl: './sign-in-style.scss',
  templateUrl: './sign-in.html',
})
export class SignIn {
  constructor(private router: Router) {}

  loginWithGoogle(): Promise<boolean> {
    const demoUser = {
      id: 'demo-google-user',
      name: 'Demo User',
      email: 'demo@beautifo.com',
      provider: 'google'
    };

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(demoUser));

    return this.router.navigate(['/profile']);
  }
}
