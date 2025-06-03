import { Component, DestroyRef, ElementRef, inject, OnInit, output, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ApiResult } from '@app/models/api-result.model';
import { AppImageData } from '@app/models/app-image-data.model';
import { UserProfile } from '@app/models/user-profile.model';
import { UserProfileService } from '@app/services/user-profile.service';
import { of, switchMap } from 'rxjs';
import { AvatarComponent } from "../../../shared/avatar/avatar.component";
import { ModalComponent } from "../../../shared/modal/modal.component";
import { UserProfileForm } from './user-profile.form';

@Component({
  selector: 'app-user-profile',
  imports: [ReactiveFormsModule, MatButtonModule, MatRippleModule, MatInputModule, MatFormFieldModule, MatSelectModule, ModalComponent, AvatarComponent],
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
  @ViewChild('disclaimer') disclaimer?: ElementRef;
  busy = false;

  private imageData?: AppImageData;
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.profileForm
      .get('preferredContactMethod')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        if (val === 'phone') {
          setTimeout(() => {
            this.disclaimer?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
          }, 125);
        }
      });
  }

  saveProfile() {
    const newProfile = {
      ...this.userProfile()!,
      ...this.profileForm.value,
      isEmailPreferred: this.profileForm.get('preferredContactMethod')?.value === 'email',
    };

    const saveProfile$ = this.userProfileService.updateProfile$(newProfile).pipe(
      switchMap((res) => {
        if (this.imageData && !res.hasError) {
          return this.imageData.image
            ? this.userProfileService.updateProfileImage$(this.imageData)
            : this.userProfileService.deleteProfileImage$();
        }

        return of(res);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((res: ApiResult) => {
      if (!res?.hasError) {
        this.closeProfile();
      }
    });;
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
        phone: new FormControl<string | null>(user.phone || null, [Validators.required]),
        preferredContactMethod: new FormControl<'email' | 'phone' | null>(user.isEmailPreferred ? 'email' : 'phone'),
      }
    );

    form.get('email')?.disable();
    form.get('phone')?.markAsTouched();

    return form;
  }
}
