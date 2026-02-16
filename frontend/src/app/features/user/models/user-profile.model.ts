import { User } from '@app/core/models/user.model';

export interface UserProfile extends User {
  phone: string | null;
  isEmailPreferred: boolean;
  createdAt: string;
}
