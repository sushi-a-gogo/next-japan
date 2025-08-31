export interface UserReward {
  userId: string;
  pointsEarned: number;
  pointsRemaining: number;
  dateOfIssue: string;
  expiration: string;
  description?: string; // e.g. 'Attended weekend camping trip', 'Special End of Summer Promotion'. etc.
  expiresSoon?: boolean;
}
