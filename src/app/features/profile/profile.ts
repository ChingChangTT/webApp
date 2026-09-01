import { Component, inject, signal } from '@angular/core';
import { profileUser } from './profile.model';
import { form, maxLength, pattern, required, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { UserStore } from '../../core/store/user-store';

@Component({
  imports: [FormField],
  selector: 'app-profile',
  styleUrl: './profile-style.scss',
  templateUrl: './profile.html',
})
export class Profile {
  protected userStore = inject(UserStore);
  protected savedMessage = signal('');
  protected imageError = signal('');
  protected avatarImage = signal('https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80');
  protected coverImage = signal('https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80');

  constructor(private router: Router) {
    this.dataLogIn(this.userStore.userProfile());
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
    required(path.email, { message: 'Email is required' });
    required(path.firstName, { message: 'First name is required' });
    required(path.lastName, { message: 'Last name is required' });
    maxLength(path.firstName, 50, { message: 'First name must be 50 characters or fewer' });
    maxLength(path.lastName, 50, { message: 'Last name must be 50 characters or fewer' });
    pattern(path.id, /^[A-Z0-9_-]+$/, { message: 'Use uppercase letters, numbers, underscore or dash' });
  });

  private dataLogIn(entity: profileUser | null): void {
    const parsedDate = entity?.dob ? new Date(entity.dob) : null;
    this.profileForm().reset({
      email: entity?.email ?? '',
      firstName: entity?.firstName ?? '',
      lastName: entity?.lastName ?? '',
      id: entity?.id?.toUpperCase() ?? '',
      sex: entity?.sex ?? '',
      dob: parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : null,
      avatarUrl: entity?.avatarUrl,
      coverUrl: entity?.coverUrl,
    });

    if (entity?.avatarUrl) this.avatarImage.set(entity.avatarUrl);
    if (entity?.coverUrl) this.coverImage.set(entity.coverUrl);
  }

  saveProfile(event: Event): void {
    event.preventDefault();
    this.savedMessage.set('');
    this.profileForm().markAsTouched();

    if (!this.profileForm().valid()) {
      this.profileForm().focusBoundControl();
      return;
    }

    const updatedUser: profileUser = {
      ...this.loginModel(),
      id: this.loginModel().id.toUpperCase(),
      avatarUrl: this.avatarImage(),
      coverUrl: this.coverImage(),
    };
    this.userStore.updateUser(updatedUser);
    this.savedMessage.set('Profile updated successfully.');
  }

  selectImage(event: Event, type: 'avatar' | 'cover'): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.imageError.set('');
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.imageError.set('Please select an image file.');
      input.value = '';
      return;
    }
    if (file.size > 1024 * 1024) {
      this.imageError.set('Image must be smaller than 1 MB.');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const image = String(reader.result);
      type === 'avatar' ? this.avatarImage.set(image) : this.coverImage.set(image);
    };
    reader.readAsDataURL(file);
  }

  logout(): Promise<boolean> {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.userStore.loadUser();

    return this.router.navigate(['/sign-in']);
  }
}
