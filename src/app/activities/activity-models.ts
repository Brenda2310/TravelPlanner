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
  imageUrl?: string;
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
  imageUrl?: string;
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
  imageUrl?: string;
}

export interface ActivityResumeDTO {
  name: string;
  description: string;
  imageUrl?: string;
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
  imageUrl?: string;
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
  imageUrl?: string;
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
  imageUrl?: string;
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
  imageUrl?: string;
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
