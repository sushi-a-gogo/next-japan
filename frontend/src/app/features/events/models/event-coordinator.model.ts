import { Avatar } from '@app/core/models/avatar.model';

export interface EventCoordinator extends Avatar {
  eventCoordinatorId: number;
  firstName: string;
  lastName: string;
  email: string;
  biography: string;
}
