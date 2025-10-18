export type ReservationStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'CANCELLED'
  | string;

export interface ReservationResponseDTO {
  id: number;
  userId: number;
  activityId: number;
  paid: boolean;
  amount: number; 
  reservationDate: string; 
  status: ReservationStatus;
  urlPayment: string; 
}

export interface ReservationCreateDTO {
  activityId: number;
}