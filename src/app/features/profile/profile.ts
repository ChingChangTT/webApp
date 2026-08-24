import { Component, signal } from '@angular/core';
import { profileUser } from './profile.model';
import { form, maxLength, pattern, required, FormField } from '@angular/forms/signals';

@Component({
  imports: [FormField],
  selector: 'app-profile',
  styleUrl: './profile-style.scss',
  templateUrl: './profile.html',
})
export class Profile {

  constructor() {
    const username =localStorage.getItem('currentUser');
    const convertdata  : profileUser | null =username ?  JSON.parse(username) : null
    this.dataLogIn(convertdata);
    console.log("User Information",this.dataLogIn(convertdata));
  }
  protected loginModel = signal<profileUser>({
    id:'',
    email: '',
    firstName : '',
    lastName:'',
    sex:'',
    dob:new Date(),
  });
  readonly profileForm = form(this.loginModel, (path) => {
    required(path.id, { message: 'ID is required' });
    maxLength(path.firstName, 5, { message: 'Name is too long' });
    pattern(path.id, /^[A-Z0-9_-]+$/, { message: 'Use uppercase letters, numbers, underscore or dash' });
  });
  private dataLogIn(entity:profileUser | null){
    console.log("data",new Date(entity?.dob ?? ''))
    this.profileForm().reset({
      email:entity?.email ??  '',
      firstName :entity?.firstName ?? '',
      lastName:entity?.lastName ?? '',
      id:entity?.id ?? '',
      sex:entity?.sex ?? '',
      dob:new Date(entity?.dob ?? '') ?? null,
    })
  }
}
