import { Avatar } from '@app/models/avatar.model';

export interface EventCoordinator extends Avatar {
  eventCoordinatorId: number;
  firstName: string;
  lastName: string;
  email: string;
}
