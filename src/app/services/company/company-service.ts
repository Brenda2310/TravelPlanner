import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedModel, EntityModel, Pageable } from '../../models/hateoas-models';
import {
  CompanyResponseDTO,
  CompanyCreateDTO,
  CompanyUpdateDTO
} from '../../models/company-models';

const API = 'http://localhost:8080/companies';

@Injectable({
  providedIn: 'root'
})

export class CompanyService {
  private http  = inject(HttpClient);

  private buildParams(pageable: Pageable): HttpParams {
    let params = new HttpParams()
      .set('page', pageable.page.toString())
      .set('size', pageable.size.toString());

    if (pageable.sort) {
      params = params.set('sort', pageable.sort);
    }
    return params;
  }

  getAllCompanies(pageable: Pageable): Observable<PagedModel<CompanyResponseDTO>> {
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<CompanyResponseDTO>>(API, { params });
  }

  getAllCompaniesInactive(pageable: Pageable): Observable<PagedModel<CompanyResponseDTO>> {
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<CompanyResponseDTO>>(`${API}/inactive`, { params });
  }

  getCompanyById(id: number): Observable<EntityModel<CompanyResponseDTO>> {
    return this.http.get<EntityModel<CompanyResponseDTO>>(`${API}/${id}`);
  }

  getProfile(): Observable<EntityModel<CompanyResponseDTO>> {
    return this.http.get<EntityModel<CompanyResponseDTO>>(`${API}/me`);
  }

  createCompany(dto: CompanyCreateDTO): Observable<EntityModel<CompanyResponseDTO>> {
    return this.http.post<EntityModel<CompanyResponseDTO>>(API, dto);
  }

  updateCompany(id: number, dto: CompanyUpdateDTO): Observable<EntityModel<CompanyResponseDTO>> {
    return this.http.put<EntityModel<CompanyResponseDTO>>(`${API}/${id}`, dto);
  }

  deleteCompany(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/${id}`); 
  }

  deleteOwnCompany(): Observable<void> {
    return this.http.delete<void>(`${API}/me`); 
  }

  restoreCompany(id: number): Observable<void> {
    return this.http.put<void>(`${API}/restore/${id}`, null); 
  }
}
