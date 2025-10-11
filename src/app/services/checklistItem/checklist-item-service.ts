import { Injectable, inject} from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedModel, EntityModel, Pageable } from '../../models/hateoas-models';
import { 
  CheckListItemCreateDTO,
  CheckListItemUpdateDTO,
  CheckListItemResponseDTO,
  CheckListItemFilterDTO
 } from '../../models/checklist-models';
import { App } from '../../app';

const API = 'http://localhost:8080/checklist-items';

@Injectable({
  providedIn: 'root'
})
export class ChecklistItemService {
  private http = inject(HttpClient);

  getAll(pageable: Pageable, completed?: boolean): Observable<PagedModel<CheckListItemResponseDTO>> {
    let params = new HttpParams()
      .set('page', pageable.page.toString())
      .set('size', pageable.size.toString());

    if (completed !== undefined && completed !== null) {
      params = params.set('completed', completed.toString());
    }
    
    return this.http.get<PagedModel<CheckListItemResponseDTO>>(`${API}`, { params });
  }

  getById(id: number): Observable<EntityModel<CheckListItemResponseDTO>> {
    return this.http.get<EntityModel<CheckListItemResponseDTO>>(`${API}/${id}`);
  }

  getItemsByUserId(userId: number, filters: CheckListItemFilterDTO, pageable: Pageable): Observable<PagedModel<CheckListItemResponseDTO>> {
    let params = new HttpParams()
      .set('page', pageable.page.toString())
      .set('size', pageable.size.toString());

      if (filters.checklistId !== undefined) {
      params = params.set('checklistId', filters.checklistId.toString());
    }
    if (filters.status !== undefined) {
      params = params.set('status', filters.status.toString());
    }

    return this.http.get<PagedModel<CheckListItemResponseDTO>>(`${API}/user/${userId}`, { params });
  }

  create(dto: CheckListItemCreateDTO): Observable<CheckListItemResponseDTO> {
    return this.http.post<CheckListItemResponseDTO>(API, dto);
  }

  update(id: number, dto: CheckListItemUpdateDTO): Observable<CheckListItemResponseDTO> {
    return this.http.put<CheckListItemResponseDTO>(`${API}/${id}`, dto);
  }

  toggleCompleted(id: number, completed: boolean): Observable<CheckListItemResponseDTO> {
    return this.http.patch<CheckListItemResponseDTO>(`${API}/toggle/${id}`, { completed });
  }

  // 7. DELETE /checklist-items/{id}
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/${id}`); // Retorna 204 No Content
  }
}
