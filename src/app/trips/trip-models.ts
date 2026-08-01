import { UserPreference } from '../users/user-models';

export interface TripResponseDTO {
  id: number;
  name: string;
  destination: string;
  startDate: string;
  endDate: string | null;
  estimatedBudget: number;
  //companions: number;
  active: boolean;
  users: { id: number; username: string}[];
  imageUrl?: string;
}

export interface TripResumeDTO {
  id: number;
  name: string;
  destination: string;
  active: boolean;
  imageUrl?: string;
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
  //companions: number;
  sharedUserIds?: number[];
  imageUrl?: string;
}

export interface TripUpdateDTO {
  name?: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  estimatedBudget?: number;
  //companions?: number;
  sharedUserIds?: number[];
  imageUrl?: string;
}

export interface TripFilterDTO {
  destination?: string;
  startDate?: string;
  endDate?: string;
}
