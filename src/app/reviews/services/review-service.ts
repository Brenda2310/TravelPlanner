import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ReviewRequest,
  ReviewResponse,
  ActivityReviewSummary,
  ActivityRatingSimple,
} from '../review-models';
import { BaseService } from '../../BaseService';

@Injectable({
  providedIn: 'root',
})
export class ReviewService extends BaseService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:8080/reviews';

  createReview(dto: ReviewRequest): Observable<ReviewResponse> {
    return this.http.post<ReviewResponse>(this.api, dto);
  }
 
  getSummaryByActivity(activityId: number): Observable<ActivityReviewSummary> {
    return this.http.get<ActivityReviewSummary>(`${this.api}/activity/${activityId}`);
  }
  
  getPromedioSimple(activityId: number): Observable<ActivityRatingSimple> {
    return this.http.get<ActivityRatingSimple>(`${this.api}/activity/${activityId}/avg`);
  }
}
