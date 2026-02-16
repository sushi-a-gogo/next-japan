import { User } from './user.model';

export interface UserProfile extends User {
  phone: string | null;
  isEmailPreferred: boolean;
  createdAt: string;
}
