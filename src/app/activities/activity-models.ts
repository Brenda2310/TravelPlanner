export type ActivityCategory =
  | 'AVENTURA'
  | 'CULTURA'
  | 'RELAX'
  | 'GASTRONOMIA'
  | 'NATURALEZA'
  | 'NIGHTLIFE'
  | 'SHOPPING'
  | 'DEPORTES'
  | 'HISTORIA'
  | 'FAMILIA';


export interface ActivityResponseDTO {
  id: number;
  price: number; 
  available: boolean;
  name: string;
  description: string;
  category: ActivityCategory;
  date: string; 
  startTime: string; 
  endTime: string; 
  itineraryId: number | null; 
  userIds: number[]; 
  companyId: number | null; 
  available_quantity: number | null; 
}

export interface ActivityCompanyResponseDTO {
  id: number;
  price: number;
  name: string;
  description: string;
  category: ActivityCategory;
  date: string;
  startTime: string;
  endTime: string;
  available_quantity: number; 
}

export interface ActivityCreateResponseDTO {
  id: number;
  price: number;
  available: boolean;
  name: string;
  description: string;
  category: ActivityCategory;
  date: string;
  startTime: string;
  endTime: string;
  itineraryId: number | null;
  userIds: number[];
}

export interface ActivityResumeDTO {
  name: string;
  description: string;
}

export interface UserActivityCreateDTO {
  price?: number; 
  name: string;
  description: string;
  category: ActivityCategory;
  date: string;
  startTime: string;
  endTime: string;
  sharedUserIds?: number[]; 
}

export interface CompanyActivityCreateDTO {
  price: number;
  name: string;
  description: string;
  category: ActivityCategory;
  date: string;
  startTime: string;
  endTime: string;
  companyId: number;
  available_quantity: number; 
}

export interface ActivityUpdateDTO {
  price?: number; 
  name: string;
  description: string;
  category: ActivityCategory;
  date: string;
  startTime?: string; 
  endTime?: string; 
  available?: boolean;
  itineraryId?: number; 
}

export interface CompanyActivityUpdateDTO {
  price: number;
  name: string;
  description: string;
  category: ActivityCategory;
  date: string;
  startTime: string;
  endTime: string;
  available_quantity: number; 
}

export interface ActivityFilterDTO {
  category?: ActivityCategory;
  startDate?: string; 
  endDate?: string; 
}

export interface CompanyActivityFilterParams extends ActivityFilterDTO {
  minPrice?: number;
  maxPrice?: number;
  availableQuantity?: number;
}