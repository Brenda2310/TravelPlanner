import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FriendRequestDTO, UserResumeDTO } from '../friend-models';

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  private readonly http = inject(HttpClient);
  private readonly usersApi = 'http://localhost:8080/users';
  private readonly friendApi = 'http://localhost:8080/friendrequest';

  searchUsers (username: string): Observable<any> {
    return this.http.get<any>(`${this.usersApi}/search`, {
      params: {username, page: 0, size: 10},
    });
  }

  sendRequest (receiverId: number): Observable<void>{
    return this.http.post<void>(`${this.friendApi}/${receiverId}`, null);
  }

  getPendingRequest (): Observable<FriendRequestDTO[]>{
    return this.http.get<FriendRequestDTO[]>(`${this.friendApi}`);
  }

  acceptRequest (requestId: number): Observable<void>{
    return this.http.put<void>(`${this.friendApi}/${requestId}/accept`, null);
  }

  rejectRequest(requestId: number): Observable<void> {
    return this.http.put<void>(`${this.friendApi}/${requestId}/denied`, null);
  }

  getFriends(): Observable<UserResumeDTO[]>{
    return this.http.get<UserResumeDTO[]>(`${this.usersApi}/friends`);
  }

}
