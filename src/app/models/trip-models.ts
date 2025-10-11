import { UserPreference } from './user-models'; 

export interface TripResponseDTO {
  id: number;
  name: string;
  destination: string;
  startDate: string; 
  endDate: string | null; 
  estimatedBudget: number; 
  companions: number;
  active: boolean;
  userIds: number[];
}

export interface TripResumeDTO {
  id: number;
  name: string;
  destination: string;
  active: boolean;
}

export interface RecommendationDTO {
  name: string;
  categories: { name: UserPreference }[]; 
}

export interface TripCreateDTO {
  name: string;
  destination: string;
  startDate: string; 
  endDate?: string; 
  estimatedBudget: number;
  companions: number;
  sharedUserIds?: number[]; 
}

export interface TripUpdateDTO {
  name?: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  estimatedBudget?: number;
  companions?: number;
}

export interface TripFilterDTO {
  destination?: string;
  startDate?: string; 
  endDate?: string;   
}