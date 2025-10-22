import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserResponseDTO, UserCreateDTO, UserUpdateDTO } from '../user-models';
import { PagedModel, EntityModel, Pageable } from '../../hateoas/hateoas-models';
import { BaseService } from '../../BaseService';

@Injectable({
  providedIn: 'root'
})

export class UserService extends BaseService{
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:8080/users'; 
  
getAllUsers(pageable: Pageable) {
  let params = this.buildParams(pageable);
  return this.http.get<PagedModel<UserResponseDTO>>(`${this.api}`, { params });
}

getAllUsersInactive(pageable: Pageable) {
  let params = this.buildParams(pageable);
  return this.http.get<PagedModel<UserResponseDTO>>(`${this.api}/inactive`, { params });
}

getProfile(){
  return this.http.get<EntityModel<UserResponseDTO>>(`${this.api}/me`);
}

getUserById(id: number){
  return this.http.get<EntityModel<UserResponseDTO>>(`${this.api}/${id}`);
}

createUser(user: UserCreateDTO){
  return this.http.post<EntityModel<UserResponseDTO>>(`${this.api}`, user);
}

updateUser(id: number, updatedUser: UserUpdateDTO){
  return this.http.put<EntityModel<UserResponseDTO>>(`${this.api}/${id}`, updatedUser);
}

updateOwnAccount(updatedUser: UserUpdateDTO){
  return this.http.put<EntityModel<UserResponseDTO>>(`${this.api}/me/update`, updatedUser);
}

restoreAccount(id: number) {
  return this.http.put(`${this.api}/restore/${id}`, null, { responseType: 'text' });
}

assignRole(id: number) {
  return this.http.put(`${this.api}/roles/${id}`, null, { responseType: 'text' });
}

deleteOwnAccount() {
  return this.http.delete(`${this.api}/me/delete`, { responseType: 'text' });
}


deleteUserAdmin(id: number) {
  return this.http.delete(`${this.api}/delete/${id}`, { responseType: 'text' });
}
}
