import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripInvitationService {
 
  private readonly http = inject(HttpClient);
  private readonly api = "http://localhost:8080/tripinvitation";

  sendInvitation(tripId: number, receiverId: number): Observable<void>{
    return this.http.post<void>(`${this.api}/${tripId}/invite/${receiverId}`, null);
  }

  getPendingInvitations(): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}/pending`);
  }

  acceptInvitation(invitationId: number): Observable<number> {
    return this.http.put<number>(`${this.api}/accept/${invitationId}`, null);
  }

  denyInvitation(invitationId: number): Observable<void> {
    return this.http.put<void>(`${this.api}/deny/${invitationId}`, null);
  }

  getSentInvitations(tripId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/sent/${tripId}`);
  }
  
}
