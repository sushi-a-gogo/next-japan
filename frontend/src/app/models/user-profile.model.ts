import { User } from './user.model';

export interface UserProfile extends User {
  addressLine1: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  phone: string | null;
  createdDate?: Date;
  lastUpdateDate?: Date;
  additionalInformation?: string;
  isEmailPreferred: boolean;
}
