import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { PagedModel, EntityModel, Pageable } from '../../hateoas/hateoas-models';
import { 
  CheckListResponseDTO,
  CheckListCreateDTO,
  CheckListUpdateDTO,
  CheckListFilterDTO } from '../checklist-models';

@Injectable({
  providedIn: 'root'
})

export class ChecklistService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:8080/checklists'; 

  create(dto: CheckListCreateDTO){
    return this.http.post<CheckListResponseDTO>(this.api, dto);
  }

  update(id: number, dto: CheckListUpdateDTO){
    return this.http.put<CheckListResponseDTO>(`${this.api}/${id}`, dto);
  }

  getById(id: number) {
    return this.http.get<EntityModel<CheckListResponseDTO>>(`${this.api}/${id}`);
  }

  getAll(pageable: Pageable) {
    let params = new HttpParams()
      .set('page', pageable.page.toString())
      .set('size', pageable.size.toString());

    if (pageable.sort) {
      params = params.set('sort', pageable.sort);
    }
    return this.http.get<PagedModel<CheckListResponseDTO>>(`${this.api}`, { params });
  }

  getAllInactive(pageable: Pageable) {
    let params = new HttpParams()
      .set('page', pageable.page.toString())
      .set('size', pageable.size.toString());
    
    return this.http.get<PagedModel<CheckListResponseDTO>>(`${this.api}/inactive`, { params });
  }

  getByUser(userId: number, filters: CheckListFilterDTO, pageable: Pageable) {
    let params = new HttpParams()
      .set('page', pageable.page.toString())
      .set('size', pageable.size.toString());

      if (filters.completed !== undefined) {
      params = params.set('completed', filters.completed.toString());
    }

    return this.http.get<PagedModel<CheckListResponseDTO>>(`${this.api}/user/${userId}`, { params });
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.api}/${id}`); 
  }

  restore(id: number) {
    return this.http.put<void>(`${this.api}/restore/${id}`, null);
  }

}
