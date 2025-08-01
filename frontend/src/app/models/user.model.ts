import { Avatar } from './avatar.model';

export interface User extends Avatar {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}
