export enum NotificationType {
  // Social
  FRIEND_REQUEST = 'FRIEND_REQUEST',
  FRIEND_REQUEST_ACCEPTED = 'FRIEND_REQUEST_ACCEPTED',

  // Trips
  TRIP_INVITE = 'TRIP_INVITE',
  TRIP_INVITE_ACCEPTED = 'TRIP_INVITE_ACCEPTED',
  TRIP_REMINDER = 'TRIP_REMINDER',
  BUDGET_EXCEEDED = 'BUDGET_EXCEEDED',
  BUDGET_HALF_SPENT = 'BUDGET_HALF_SPENT',

  // Shared expenses
  SHARED_EXPENSE_ASSIGNED = 'SHARED_EXPENSE_ASSIGNED',
  SHARED_EXPENSE_SETTLED = 'SHARED_EXPENSE_SETTLED',

  // Activities and Reservation
  RESERVATION_CONFIRMED = 'RESERVATION_CONFIRMED',
  RESERVATION_CANCELLED = 'RESERVATION_CANCELLED',

  // Payments
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',

  // Activities
  ACTIVITY_REMINDER = 'ACTIVITY_REMINDER',
}

export enum NotificationCategory {
  SOCIAL = 'SOCIAL',
  TRIPS = 'TRIPS',
  PAYMENTS = 'PAYMENTS',
}
export interface NotificationCreateDTO {
  userId: number;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  body: string;
  relatedEntityId?: number;
  relatedEntityType?: 'RESERVATION' | 'EXPENSE' | 'TRIP' | 'USER';
}

export interface NotificationResponseDTO {
  id: number;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  body: string;
  relatedEntityId: number;
  relatedEntityType: string;
  read: boolean;
  createdAt: string;
  readAt?: string;
}

export interface Summary {
  unreadCount: number;
  notifications: NotificationResponseDTO[];
}
