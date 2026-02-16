
export interface UserProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredContactMethod: 'email' | 'phone';
}
