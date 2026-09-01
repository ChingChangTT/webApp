import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserStore } from '../../core/store/user-store';

@Component({
  imports: [],
  selector: 'app-sign-in',
  styleUrl: './sign-in-style.scss',
  templateUrl: './sign-in.html',
})
export class SignIn {
  private readonly userStore = inject(UserStore);
  constructor(private router: Router) {}

  loginWithGoogle(): Promise<boolean> {
    const demoUser = {
      id: 'demo-google-user',
      firstName: 'Ratana',
      lastName:'Keo',
      email: 'demo@beautifo.com',
      sex: 'female',
      dob:'2005-04-13',
      password:'Demo@123'
    };

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(demoUser));
    this.userStore.loadUser();
    return this.router.navigate(['/account/profile']);
  }
}
