import { inject, Injectable } from '@angular/core';
import { BaseService } from '../../BaseService';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationCategory, Summary } from '../notifications-models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:8080/notifications';

  getNotifications(category?: NotificationCategory): Observable<Summary> {
    let params = new HttpParams();
    
    if (category) {
      params = params.set('category', category);
    }
    return this.http.get<Summary>(this.api, { params });
  }

  getUnreadCount(): Observable<{ unreadCount: number }> {
    return this.http.get<{ unreadCount: number }>(`${this.api}/unread-count`);
  }

  markAsRead(id: number): Observable<void> {
    return this.http.patch<void>(`${this.api}/${id}/read`, {});
  }

  markAllAsRead(): Observable<{ updated: number }> {
    return this.http.patch<{ updated: number }>(`${this.api}/read-all`, {});
  }
}
