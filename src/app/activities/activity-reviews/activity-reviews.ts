import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivityReviewSummary, ReviewRequest, ReviewResponse } from '../../reviews/review-models';
import { ReviewService } from '../../reviews/services/review-service';
import { CommonModule } from '@angular/common';

type SummaryKeys = 'guideAvg' | 'puntualityAvg' | 'priceAvg' | 'securityAvg';

@Component({
  selector: 'app-activity-reviews',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './activity-reviews.html',
  styleUrl: './activity-reviews.css',
})
export class ActivityReviews implements OnInit, OnChanges {
  @Input() activityId!: number;
  @Input() tieneReservaCompletada: boolean = false;

  summary: ActivityReviewSummary | null = null;
  loading = true;
  error = '';

  showForm = false;
  submitLoading = false;
  submitError = '';
  submitSuccess = false;

  sortBy: 'recientes' | 'mayor' | 'menor' = 'recientes';

  reviewForm!: FormGroup;

  hoverRating: Record<string, number> = {};

  readonly aspectos = [
    { key: 'ratingGuide', label: 'Guía / Atención' },
    { key: 'ratingPuntuality', label: 'Puntualidad' },
    { key: 'ratingPrice', label: 'Precio' },
    { key: 'ratingSecurity', label: 'Seguridad' },
  ];

  readonly aspectosResumen: { key: SummaryKeys; label: string }[] = [
    { key: 'guideAvg', label: 'Guía / Atención' },
    { key: 'puntualityAvg', label: 'Puntualidad' },
    { key: 'priceAvg', label: 'Precio' },
    { key: 'securityAvg', label: 'Seguridad' },
  ];

  readonly starsArray = [1, 2, 3, 4, 5];

  constructor(
    private reviewService: ReviewService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    if (this.activityId) {
      this.loadSummary();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('activityId change:', changes['activityId']);
    if (changes['activityId'] && this.activityId) {
      this.loadSummary();
    }
  }

  private buildForm(): void {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      comentary: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],

      ratingGuide: [0, Validators.required],
      ratingPuntuality: [0, Validators.required],
      ratingPrice: [0, Validators.required],
      ratingSecurity: [0, Validators.required],
    });
  }

  loadSummary(showLoader: boolean = true): void {
    if (showLoader) {
      this.loading = true;
    }
    this.error = '';

    this.reviewService.getSummaryByActivity(this.activityId).subscribe({
      next: (data) => {
        this.summary = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'No se pudieron cargar las reseñas.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  setRating(field: string, value: number): void {
    this.reviewForm.patchValue({ [field]: value });
  }

  setHover(field: string, value: number): void {
    this.hoverRating[field] = value;
  }

  clearHover(field: string): void {
    this.hoverRating[field] = 0;
  }

  getStarValue(field: string): number {
    return this.hoverRating[field] || this.reviewForm.get(field)?.value || 0;
  }

  get comentaryLength(): number {
    return this.reviewForm.get('comentary')?.value?.length || 0;
  }

  submitReview(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    this.submitLoading = true;
    this.submitError = '';

    const dto: ReviewRequest = {
      activityId: this.activityId,
      ...this.reviewForm.value,
    };

    this.reviewService.createReview(dto).subscribe({
      next: (newReview) => {
        this.submitLoading = false;
        this.submitSuccess = true;
        this.showForm = false;
        this.reviewForm.reset({
          rating: 0,
          title: '',
          comentary: '',
          ratingGuide: 0,
          ratingPuntuality: 0,
          ratingPrice: 0,
          ratingSecurity: 0,
        });

        this.loadSummary(false);

        setTimeout(() => (this.submitSuccess = false), 4000);
      },
      error: (err) => {
        this.submitLoading = false;
        this.submitError =
          err.status === 409
            ? 'Ya reseñaste esta actividad.'
            : err.status === 403
              ? 'Solo podés reseñar actividades que hayas reservado y pagado.'
              : 'Ocurrió un error. Intentá de nuevo.';
      },
    });
  }

  get sortedReviews(): ReviewResponse[] {
    if (!this.summary) return [];
    return [...this.summary.reviews].sort((a, b) => {
      if (this.sortBy === 'mayor') return b.rating - a.rating;
      if (this.sortBy === 'menor') return a.rating - b.rating;
      return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
    });
  }

  getDistribucionPct(star: number): number {
    if (!this.summary || this.summary.totalReviews === 0) return 0;
    return ((this.summary.distribution[star] || 0) / this.summary.totalReviews) * 100;
  }

  private recalcularPromedio(): void {
    if (!this.summary || this.summary.reviews.length === 0) return;
    const sum = this.summary.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.summary.generalAvg = Math.round((sum / this.summary.reviews.length) * 10) / 10;
  }

  // get canReview(): boolean {
  //   return this.tieneReservaCompletada && !(this.summary?.userYaReseno ?? false);
  // }

  get canReview(): boolean {
    return !!this.tieneReservaCompletada && !(this.summary?.userYaReseno ?? false);
  }

  private updateDistribution(nuevaRating: number): void {
    if (!this.summary) return;

    this.summary.distribution[nuevaRating] = (this.summary.distribution[nuevaRating] || 0) + 1;
  }
}
