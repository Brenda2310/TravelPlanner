import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserResponseDTO, UserCreateDTO, UserUpdateDTO } from '../../models/user-models';
import { PagedModel, EntityModel, Pageable } from '../../models/hateoas-models';

const API = 'http://localhost:8080/users'; 

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private http = inject(HttpClient);
  
  getAllUsers(pageable: Pageable): Observable<PagedModel<UserResponseDTO>> {
  let params = new HttpParams()
    .set('page', pageable.page.toString())
    .set('size', pageable.size.toString());

  if (pageable.sort) {
    params = params.set('sort', pageable.sort);
  }

  return this.http.get<PagedModel<UserResponseDTO>>(`${API}`, { params });
}

getAllUsersInactive(pageable: Pageable): Observable<PagedModel<UserResponseDTO>> {
  let params = new HttpParams()
    .set('page', pageable.page.toString())
    .set('size', pageable.size.toString());

  if (pageable.sort) {
    params = params.set('sort', pageable.sort);
  }

  return this.http.get<PagedModel<UserResponseDTO>>(`${API}/inactive`, { params });
}

getProfile(): Observable<EntityModel<UserResponseDTO>> {
  return this.http.get<EntityModel<UserResponseDTO>>(`${API}/me`);
}

getUserById(id: number): Observable<EntityModel<UserResponseDTO>> {
  return this.http.get<EntityModel<UserResponseDTO>>(`${API}/${id}`);
}

createUser(user: UserCreateDTO): Observable<EntityModel<UserResponseDTO>> {
  return this.http.post<EntityModel<UserResponseDTO>>(`${API}`, user);
}

updateUser(id: number, updatedUser: UserUpdateDTO): Observable<EntityModel<UserResponseDTO>> {
  return this.http.put<EntityModel<UserResponseDTO>>(`${API}/${id}`, updatedUser);
}

updateOwnAccount(updatedUser: UserUpdateDTO): Observable<EntityModel<UserResponseDTO>> {
  return this.http.put<EntityModel<UserResponseDTO>>(`${API}/me/update`, updatedUser);
}

restoreAccount(id: number): Observable<string> {
  return this.http.put(`${API}/restore/${id}`, null, { responseType: 'text' });
}

assignRole(id: number): Observable<string> {
  return this.http.put(`${API}/roles/${id}`, null, { responseType: 'text' });
}

deleteOwnAccount(): Observable<string> {
  return this.http.delete(`${API}/me/delete`, { responseType: 'text' });
}


deleteUserAdmin(id: number): Observable<string> {
  return this.http.delete(`${API}/delete/${id}`, { responseType: 'text' });
}
}
