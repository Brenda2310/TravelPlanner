export interface EntityModel<T> {
  content: T;
  _links: any; 
}

export interface PageMetadata {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface PagedModel<T> {
  _embedded: {
    [key: string]: EntityModel<T>[];
  };
  _links: any;
  page: PageMetadata;
}

export interface Pageable {
  page: number;
  size: number;
  sort?: string;
}

export interface PaginationInfo {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface CollectionState<T> {
  list: T[]; 
  loading: boolean;
  pageInfo: PaginationInfo;
}