import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ActivityRatingSimple } from '../../reviews/review-models';
import { ReviewService } from '../../reviews/services/review-service';
import { SecurityStore } from '../../security/services/security-store';
import { ActivityCompanyResponseDTO } from '../activity-models';

@Component({
  selector: 'app-activity-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-card.html',
  styleUrl: './activity-card.css',
})
export class ActivityCard implements OnInit {
  private readonly router = inject(Router);
  private readonly reviewService = inject(ReviewService);
  public readonly security = inject(SecurityStore);
  @Input() activity!: ActivityCompanyResponseDTO;
  @Output() reservate = new EventEmitter<number>();
  @Input() type: 'user' | 'company' = 'user';

  rating: ActivityRatingSimple = { average: 0, total: 0 };
  stars = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    this.reviewService.getPromedioSimple(this.activity.id).subscribe({
      next: (data) => (this.rating = data),
      error: () => (this.rating = { average: 0, total: 0 }),
    });
  }

  isFilled(star: number): boolean {
    return star <= Math.round(this.rating.average);
  }

  onAdd(): void {
    this.reservate.emit(this.activity.id);
  }

  toDetails() {
    this.router.navigateByUrl(`/activities/${this.activity.id}`);
  }
}
