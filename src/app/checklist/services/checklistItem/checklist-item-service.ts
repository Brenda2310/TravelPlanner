import { Injectable, inject} from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { PagedModel, EntityModel, Pageable } from '../../../hateoas/hateoas-models';
import { 
  CheckListItemFilterDTO,
  CheckListItemCreateDTO,
  CheckListItemUpdateDTO,
  CheckListItemResponseDTO
 } from '../../checklist-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChecklistItemService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:8080/checklist-items';

  getAll(pageable: Pageable, completed?: boolean) {
    let params = new HttpParams()
      .set('page', pageable.page.toString())
      .set('size', pageable.size.toString());

    if (completed !== undefined && completed !== null) {
      params = params.set('completed', completed.toString());
    }
    
    return this.http.get<PagedModel<CheckListItemResponseDTO>>(`${this.api}`, { params });
  }

  getById(id: number) {
    return this.http.get<EntityModel<CheckListItemResponseDTO>>(`${this.api}/${id}`);
  }

  getItemsByUserId(userId: number, filters: CheckListItemFilterDTO, pageable: Pageable){
    let params = new HttpParams()
      .set('page', pageable.page.toString())
      .set('size', pageable.size.toString());

      if (filters.checklistId !== undefined) {
      params = params.set('checklistId', filters.checklistId.toString());
    }
    if (filters.status !== undefined) {
      params = params.set('status', filters.status.toString());
    }

    return this.http.get<PagedModel<CheckListItemResponseDTO>>(`${this.api}/user/${userId}`, { params });
  }

  getByChecklistId(checklistId: number, pageable: Pageable) {
    const params = new HttpParams()
      .set('page', pageable.page.toString())
      .set('size', pageable.size.toString());

    return this.http.get<PagedModel<EntityModel<CheckListItemResponseDTO>>>(
      `${this.api}/checklist/${checklistId}`,
      { params }
    );
  }

  create(dto: CheckListItemCreateDTO) {
    return this.http.post<CheckListItemResponseDTO>(this.api, dto);
  }

  update(id: number, dto: CheckListItemUpdateDTO) {
    return this.http.put<CheckListItemResponseDTO>(`${this.api}/${id}`, dto);
  }

  updateCheckListItemStatus(id: number): Observable<CheckListItemResponseDTO> {
    return this.http.put<CheckListItemResponseDTO>(
      `${this.api}/toggle/${id}`,
      {}
    );
  }


  delete(id: number) {
    return this.http.delete<void>(`${this.api}/${id}`); 
  }
}
