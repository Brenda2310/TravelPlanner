import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedModel, EntityModel, Pageable } from '../../models/hateoas-models';
import {
  ExpenseResponseDTO,
  ExpenseResumeDTO,
  ExpenseCreateDTO,
  ExpenseUpdateDTO,
  ExpenseFilterDTO,
  ExpenseCategory
} from '../../models/expense-models';

const API = 'http://localhost:8080/expense';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private http = inject(HttpClient);

  private buildParams(pageable: Pageable, filters: any = {}): HttpParams {
    let params = new HttpParams()
      .set('page', pageable.page.toString())
      .set('size', pageable.size.toString());

    if (pageable.sort) {
      params = params.set('sort', pageable.sort);
    }
  
    for (const key in filters) {
      if (filters[key] !== undefined && filters[key] !== null) {
        params = params.set(key, filters[key].toString());
      }
    }
    return params;
  }

  createExpense(dto: ExpenseCreateDTO): Observable<ExpenseResponseDTO> {
    return this.http.post<ExpenseResponseDTO>(`${API}`, dto);
  }

  getAllExpenses(pageable: Pageable, category?: ExpenseCategory): Observable<PagedModel<ExpenseResponseDTO>> {
    const filters = category ? { category: category } : {};
    const params = this.buildParams(pageable, filters);
    return this.http.get<PagedModel<ExpenseResponseDTO>>(`${API}`, { params });
  }

  getAllExpensesInactive(pageable: Pageable): Observable<PagedModel<ExpenseResponseDTO>> {
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<ExpenseResponseDTO>>(`${API}/inactive`, { params });
  }

  getExpenseById(id: number): Observable<EntityModel<ExpenseResumeDTO>> {
    return this.http.get<EntityModel<ExpenseResumeDTO>>(`${API}/${id}`);
  }

  getExpensesByUserId(userId: number, filters: ExpenseFilterDTO, pageable: Pageable): Observable<PagedModel<ExpenseResumeDTO>> {
    const params = this.buildParams(pageable, filters);
    return this.http.get<PagedModel<ExpenseResumeDTO>>(`${API}/user/${userId}`, { params });
  }

  updateExpense(id: number, dto: ExpenseUpdateDTO): Observable<ExpenseResumeDTO> {
    return this.http.put<ExpenseResumeDTO>(`${API}/${id}`, dto);
  }

  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/${id}`); 
  }

  restoreExpense(id: number): Observable<void> {
    return this.http.put<void>(`${API}/restore/${id}`, null); 
  }

  getExpensesByTripId(tripId: number, pageable: Pageable): Observable<PagedModel<ExpenseResumeDTO>> {
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<ExpenseResumeDTO>>(`${API}/trip/${tripId}`, { params });
  }

  getAverageExpensesByUser(userId: number): Observable<number> {
    return this.http.get<number>(`${API}/averageByUserId/${userId}`);
  }

  getRealAverageExpenseByUser(userId: number): Observable<number> {
    return this.http.get<number>(`${API}/realAverageByUserId/${userId}`);
  }

  getAverageExpensesByTrip(tripId: number): Observable<number> {
    return this.http.get<number>(`${API}/averageByTripId/${tripId}`);
  }

  getTotalExpensesByTrip(tripId: number): Observable<number> {
    return this.http.get<number>(`${API}/totalByTripId/${tripId}`);
  }

  getTotalRealExpensesByUser(userId: number): Observable<number> {
    return this.http.get<number>(`${API}/realTotalByUserId/${userId}`);
  }

}