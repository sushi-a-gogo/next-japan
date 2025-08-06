import { Component, DestroyRef, inject, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { UserProfile } from '@app/models/user-profile.model';
import { UserProfileService } from '@app/services/user-profile.service';
import { UserAvatarComponent } from "@shared/avatar/user-avatar/user-avatar.component";
import { ModalComponent } from "@shared/modal/modal.component";
import { UserProfileForm } from './user-profile.form';

@Component({
  selector: 'app-user-profile',
  imports: [RouterLink, ReactiveFormsModule, MatButtonModule, MatRippleModule, MatInputModule,
    MatFormFieldModule, MatSelectModule, ModalComponent, UserAvatarComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  private userProfileService = inject(UserProfileService);
  userProfile = this.userProfileService.userProfile;
  profileForm = this.getProfileForm(this.userProfile()!);
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
  }

  saveProfile() {
    const newProfile = {
      ...this.userProfile()!,
      ...this.profileForm.value,
      isEmailPreferred: this.profileForm.get('preferredContactMethod')?.value === 'email',
    };

    const saveProfile$ = this.userProfileService.updateProfile$(newProfile).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => { },
      error: () => { },
      complete: () => this.closeProfile()
    });
  }

  closeProfile() {
    this.close.emit(true);
  }

  private getProfileForm(user: UserProfile) {
    const textValidators = [Validators.maxLength(100)];

    const form = new FormGroup<UserProfileForm>(
      {
        firstName: new FormControl<string>(user.firstName, { nonNullable: true, validators: [Validators.required, ...textValidators] }),
        lastName: new FormControl<string>(user.lastName, { nonNullable: true, validators: [Validators.required, ...textValidators] }),
        email: new FormControl<string>(user.email, {
          nonNullable: true,
        }),
        addressLine1: new FormControl<string | null>(user.addressLine1 || null, []),
        city: new FormControl<string | null>(user.city || null, []),
        state: new FormControl<string | null>(user.state || null),
        zip: new FormControl<string | null>(user.zip || null, []),
        phone: new FormControl<string | null>(user.phone || null, user.isEmailPreferred ? [] : [Validators.required]),
        preferredContactMethod: new FormControl<'email' | 'phone' | null>(user.isEmailPreferred ? 'email' : 'phone'),
      }
    );

    form.get('email')?.disable();
    return form;
  }
}
