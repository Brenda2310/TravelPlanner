import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../BaseService';
import {
  ActivityRatingSimple,
  ActivityReviewSummary,
  ReviewRequest,
  ReviewResponse,
} from '../review-models';

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

  getSimpleAvg(activityId: number): Observable<ActivityRatingSimple> {
    return this.http.get<ActivityRatingSimple>(`${this.api}/activity/${activityId}/avg`);
  }
}
