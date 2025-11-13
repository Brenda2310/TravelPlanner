export interface CheckListItemResponseDTO {
  id: number;
  description: string;
  status: boolean;
  userId: number;
  checklistId: number;
}

export interface CheckListItemCreateDTO {
  description: string;
  checklistId: number;
}

export interface CheckListItemUpdateDTO {
  description: string;
  status: boolean;
  checklistId: number;
}

export interface CheckListItemFilterDTO {
  checklistId?: number; 
  status?: boolean;   
}

export interface CheckListResponseDTO {
  id: number;
  name: string;
  completed: boolean; 
  tripId: number;
  userId: number;
  items: CheckListItemResponseDTO[]; 
}

export interface CheckListCreateDTO {
  name: string;
  tripId: number;
}

export interface CheckListUpdateDTO {
  name: string;
  completed?: boolean; 
  tripId: number;
}

export interface CheckListFilterDTO {
  completed?: boolean;
  active?: boolean;
}