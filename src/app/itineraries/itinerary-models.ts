import { ActivityResumeDTO } from "../activities/activity-models";

export interface ItineraryResponseDTO {
  id: number;
  itineraryDate: string; 
  notes?: string;
  activities: ActivityResumeDTO[];
  userId: number;
  tripId: number;
}

export interface ItineraryCreateDTO {
  itineraryDate: string; 
  notes?: string;
  tripId: number;
}

export interface ItineraryUpdateDTO {
  itineraryDate?: string; 
  notes?: string;
}

export interface ItineraryFilterDTO {
  dateFrom?: string; 
  dateTo?: string; 
}