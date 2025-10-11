export type ExpenseCategory =
  | 'TRANSPORTE'
  | 'ALOJAMIENTO'
  | 'COMIDA'
  | 'ACTIVIDADES'
  | 'SOUVENIRS'
  | 'TICKETS'
  | 'INESPERADO'
  | 'SALUD'
  | 'COMUNICACION'
  | 'OTROS';

export interface ExpenseResponseDTO {
  id: number;
  category: ExpenseCategory;
  description: string;
  amount: number; 
  date: string; 
  userIds: number[]; 
  dividedAmount: number;
  tripId: number;
  budgetWarning?: string;
}

export interface ExpenseResumeDTO {
  id: number;
  category: string; 
  description: string;
  amount: number;
  date: string; 
  userIds: number[];
  tripId: number;
}

export interface ExpenseCreateDTO {
  category: ExpenseCategory;
  description?: string;
  amount: number;
  date: string; 
  sharedUserIds?: number[]; 
  tripId: number;
}

export interface ExpenseUpdateDTO {
  category: ExpenseCategory;
  description?: string;
  amount: number;
  date: string; 
  tripId: number; 
}

export interface ExpenseFilterDTO {
  category?: ExpenseCategory;
  minAmount?: number;
  maxAmount?: number;
  startDate?: string; 
  endDate?: string; 
}