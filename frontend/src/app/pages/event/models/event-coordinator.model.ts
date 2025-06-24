import { Avatar } from '@app/models/avatar.model';

export interface EventCoordinator extends Avatar {
  eventId: number;
  eventCoordinatorId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  preferredContactMethod?: string;
}
