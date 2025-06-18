import { Avatar } from './avatar.model';

export interface User extends Avatar {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
}
