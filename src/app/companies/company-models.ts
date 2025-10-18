import { ActivityResumeDTO } from "./activity-models";

export interface CompanyResponseDTO {
  id: number;
  username: string;
  taxId: string;
  location: string;
  description: string;
  phone: string;
  active: boolean;
  activities: ActivityResumeDTO[];
}

export interface CompanyCreateDTO {
  username: string;
  email: string;
  password?: string; 
  taxId: string;
  location: string;
  phone: string;
  description: string;
}

export interface CompanyUpdateDTO {
  username: string;
  email: string;
  password?: string; 
  location?: string;
  taxId: string;
  phone: string;
  active?: boolean;
  description?: string;
  activities?: ActivityResumeDTO[];
}