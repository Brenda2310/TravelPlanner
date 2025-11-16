import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PagedModel, EntityModel, Pageable } from '../../hateoas/hateoas-models';
import { 
  ExpenseResponseDTO,
  ExpenseResumeDTO,
  ExpenseCreateDTO,
  ExpenseUpdateDTO,
  ExpenseFilterDTO,
  ExpenseCategory } 
  from '../expense-models';
import { BaseService } from '../../BaseService';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService extends BaseService{
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:8080/expenses';

  createExpense(dto: ExpenseCreateDTO){
    return this.http.post<ExpenseResponseDTO>(`${this.api}`, dto).pipe(
          catchError((err) => {
            return throwError(() => err);
          })
        );;
  }

  getAllExpenses(pageable: Pageable, category?: ExpenseCategory){
    const filters = category ? { category: category } : {};
    const params = this.buildParams(pageable, filters);
    return this.http.get<PagedModel<ExpenseResponseDTO>>(`${this.api}`, { params });
  }

  getAllExpensesInactive(pageable: Pageable){
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<ExpenseResponseDTO>>(`${this.api}/inactive`, { params });
  }

  getExpenseById(id: number){
    return this.http.get<EntityModel<ExpenseResumeDTO>>(`${this.api}/${id}`);
  }

  getExpensesByUserId(userId: number, filters: ExpenseFilterDTO, pageable: Pageable){
    const params = this.buildParams(pageable, filters);
    return this.http.get<PagedModel<ExpenseResumeDTO>>(`${this.api}/user/${userId}`, { params });
  }

  updateExpense(id: number, dto: ExpenseUpdateDTO){
    return this.http.put<ExpenseResumeDTO>(`${this.api}/${id}`, dto).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );;
  }

  deleteExpense(id: number){
    return this.http.delete<void>(`${this.api}/${id}`); 
  }

  restoreExpense(id: number){
    return this.http.put<void>(`${this.api}/restore/${id}`, null); 
  }

  getExpensesByTripId(tripId: number, pageable: Pageable){
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<ExpenseResumeDTO>>(`${this.api}/trip/${tripId}`, { params });
  }

  getAverageExpensesByUser(userId: number) {
    return this.http.get<number>(`${this.api}/averageByUserId/${userId}`);
  }

  getRealAverageExpenseByUser(userId: number) {
    return this.http.get<number>(`${this.api}/realAverageByUserId/${userId}`);
  }

  getAverageExpensesByTrip(tripId: number) {
    return this.http.get<number>(`${this.api}/averageByTripId/${tripId}`);
  }

  getTotalExpensesByTrip(tripId: number) {
    return this.http.get<number>(`${this.api}/totalByTripId/${tripId}`);
  }

  getTotalRealExpensesByUser(userId: number) {
    return this.http.get<number>(`${this.api}/realTotalByUserId/${userId}`);
  }

}