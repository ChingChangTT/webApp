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
      firstName: 'Ratana',
      lastName:'Keo',
      email: 'demo@beautifo.com',
      sex: 'female',
      dob:'2005-04-13'
    };

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(demoUser));
    console.log("test",demoUser)
    return this.router.navigate(['/profile']);
  }
}
