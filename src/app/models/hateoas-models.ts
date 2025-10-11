// Interfaces para manejar la respuesta paginada y HATEOAS
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