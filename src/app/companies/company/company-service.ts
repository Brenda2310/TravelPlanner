import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PagedModel, EntityModel, Pageable } from '../../hateoas/hateoas-models';
import { 
  CompanyResponseDTO,
  CompanyCreateDTO,
  CompanyUpdateDTO } 
  from '../company-models';
import { BaseService } from '../../BaseService';

@Injectable({
  providedIn: 'root'
})

export class CompanyService extends BaseService{
  private readonly http  = inject(HttpClient);
  private readonly api = 'http://localhost:8080/companies';

  getAllCompanies(pageable: Pageable) {
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<CompanyResponseDTO>>(this.api, { params });
  }

  getAllCompaniesInactive(pageable: Pageable) {
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<CompanyResponseDTO>>(`${this.api}/inactive`, { params });
  }

  getCompanyById(id: number){
    return this.http.get<EntityModel<CompanyResponseDTO>>(`${this.api}/${id}`);
  }

  getProfile(){
    return this.http.get<EntityModel<CompanyResponseDTO>>(`${this.api}/me`);
  }

  createCompany(dto: CompanyCreateDTO){
    return this.http.post<EntityModel<CompanyResponseDTO>>(this.api, dto);
  }

  updateCompany(id: number, dto: CompanyUpdateDTO){
    return this.http.put<EntityModel<CompanyResponseDTO>>(`${this.api}/${id}`, dto);
  }

  deleteCompany(id: number)  {
    return this.http.delete<void>(`${this.api}/${id}`); 
  }

  deleteOwnCompany() {
    return this.http.delete<void>(`${this.api}/me`); 
  }

  restoreCompany(id: number)  {
    return this.http.put<void>(`${this.api}/restore/${id}`, null); 
  }
}
