import { Component, computed, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounce, email, Field, form, required } from '@angular/forms/signals';
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

interface UserProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredContactMethod: 'email' | 'phone';
}

@Component({
  selector: 'app-user-profile',
  imports: [Field, MatButtonModule, MatRippleModule, MatInputModule,
    MatFormFieldModule, MatSelectModule, ModalComponent, UserAvatarComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private userProfileService = inject(UserProfileService);

  user = input.required<User>();
  userProfile?: UserProfile;

  private profileModel = signal<UserProfileForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredContactMethod: 'email'
  });

  profileForm = form(this.profileModel, (schemaPath) => {
    required(schemaPath.firstName);
    required(schemaPath.lastName);

    debounce(schemaPath.email, 500);
    required(schemaPath.email);
    email(schemaPath.email);

    required(schemaPath.phone, {
      message: 'Phone is required',
      when: ({ valueOf }) => valueOf(schemaPath.preferredContactMethod) === 'phone'
    });
  });

  showPhoneHint = computed(() => this.profileForm.phone().errors().find((e) => e.message === 'Phone is required'));

  close = output<boolean>();

  contactMethods = [
    { value: 'email', viewValue: 'Email' },
    { value: 'phone', viewValue: 'Phone' },
  ];
  busy = false;

  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.userProfileService.getUser$(this.user()!.userId).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((res) => {
      if (res.success && res.data) {
        this.userProfile = res.data;
        this.profileModel.set({
          firstName: this.userProfile.firstName,
          lastName: this.userProfile.lastName,
          email: this.userProfile.email,
          phone: this.userProfile.phone || '',
          preferredContactMethod: this.userProfile.isEmailPreferred ? 'email' : 'phone'
        });
      }
    });
  }

  saveProfile() {
    const newProfile: UserProfile = {
      ...this.userProfile!,
      ...this.profileForm().value(),
      isEmailPreferred: this.profileForm().value().preferredContactMethod === 'email',
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
}
