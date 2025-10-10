import { Component, DestroyRef, inject, input, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserProfile } from '@app/models/user-profile.model';
import { User } from '@app/models/user.model';
import { AuthService } from '@app/services/auth.service';
import { UserProfileService } from '@app/services/user-profile.service';
import { UserAvatarComponent } from "@shared/avatar/user-avatar/user-avatar.component";
import { ModalComponent } from "@shared/modal/modal.component";
import { UserProfileForm } from './user-profile.form';

@Component({
  selector: 'app-user-profile',
  imports: [ReactiveFormsModule, MatButtonModule, MatRippleModule, MatInputModule,
    MatFormFieldModule, MatSelectModule, ModalComponent, UserAvatarComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private userProfileService = inject(UserProfileService);

  user = input.required<User>();
  userProfile?: UserProfile;
  profileForm = this.getProfileForm();
  close = output<boolean>();

  contactMethods = [
    { value: 'email', viewValue: 'Email' },
    { value: 'phone', viewValue: 'Phone' },
  ];
  busy = false;

  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.profileForm.get('preferredContactMethod')?.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(val => {
      const phoneControl = this.profileForm.get('phone');
      if (val === 'phone') {
        phoneControl?.setValidators([Validators.required]);
      } else {
        phoneControl?.clearValidators();
      }
      phoneControl?.updateValueAndValidity();
    });

    this.userProfileService.getUser$(this.user()!.userId).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((res) => {
      if (res.success && res.data) {
        this.userProfile = res.data;
        this.profileForm.setValue({
          firstName: this.userProfile.firstName,
          lastName: this.userProfile.lastName,
          email: this.userProfile.email,
          phone: this.userProfile.phone || null,
          preferredContactMethod: this.userProfile.isEmailPreferred ? 'email' : 'phone'
        });
      }
    });
  }

  saveProfile() {
    const newProfile = {
      ...this.userProfile!,
      ...this.profileForm.value,
      firstName: this.profileForm.value.firstName!,
      lastName: this.profileForm.value.lastName!,
      email: this.profileForm.value.email!,
      isEmailPreferred: this.profileForm.get('preferredContactMethod')?.value === 'email',
    };

    this.busy = true;
    this.userProfileService.updateProfile$(newProfile).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.authService.updateUserData(res.data);
        }
        this.busy = false;
        this.closeProfile();
      },
      error: () => { this.busy = false; }
    });
  }

  closeProfile() {
    this.close.emit(true);
  }

  private getProfileForm() {
    const textValidators = [Validators.maxLength(100)];

    const form = new FormGroup<UserProfileForm>(
      {
        firstName: new FormControl<string | null>(null, [Validators.required, ...textValidators]),
        lastName: new FormControl<string | null>(null, [Validators.required, ...textValidators]),
        email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
        phone: new FormControl<string | null>(null),
        preferredContactMethod: new FormControl<'email' | 'phone' | null>(null),
      }
    );

    return form;
  }
}
