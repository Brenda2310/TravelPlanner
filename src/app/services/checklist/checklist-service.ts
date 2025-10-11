import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedModel, EntityModel, Pageable } from '../../models/hateoas-models';
import { 
  CheckListResponseDTO,
  CheckListCreateDTO,
  CheckListUpdateDTO,
  CheckListFilterDTO } from '../../models/checklist-models';
import { App } from '../../app';

const API = 'http://localhost:8080/checklists'; 

@Injectable({
  providedIn: 'root'
})


export class ChecklistService {
  private http = inject(HttpClient);

  create(dto: CheckListCreateDTO): Observable<CheckListResponseDTO> {
    return this.http.post<CheckListResponseDTO>(API, dto);
  }

  update(id: number, dto: CheckListUpdateDTO): Observable<CheckListResponseDTO> {
    return this.http.put<CheckListResponseDTO>(`${API}/${id}`, dto);
  }

  getById(id: number): Observable<EntityModel<CheckListResponseDTO>> {
    return this.http.get<EntityModel<CheckListResponseDTO>>(`${API}/${id}`);
  }

  getAll(pageable: Pageable): Observable<PagedModel<CheckListResponseDTO>> {
    let params = new HttpParams()
      .set('page', pageable.page.toString())
      .set('size', pageable.size.toString());

    if (pageable.sort) {
      params = params.set('sort', pageable.sort);
    }
    return this.http.get<PagedModel<CheckListResponseDTO>>(`${API}`, { params });
  }

  getAllInactive(pageable: Pageable): Observable<PagedModel<CheckListResponseDTO>> {
    let params = new HttpParams()
      .set('page', pageable.page.toString())
      .set('size', pageable.size.toString());
    
    return this.http.get<PagedModel<CheckListResponseDTO>>(`${API}/inactive`, { params });
  }

  getByUser(userId: number, filters: CheckListFilterDTO, pageable: Pageable): Observable<PagedModel<CheckListResponseDTO>> {
    let params = new HttpParams()
      .set('page', pageable.page.toString())
      .set('size', pageable.size.toString());

      if (filters.completed !== undefined) {
      params = params.set('completed', filters.completed.toString());
    }

    return this.http.get<PagedModel<CheckListResponseDTO>>(`${API}/user/${userId}`, { params });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/${id}`); 
  }

  restore(id: number): Observable<void> {
    return this.http.put<void>(`${API}/restore/${id}`, null);
  }

}
