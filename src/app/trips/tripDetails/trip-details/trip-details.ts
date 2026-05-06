import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseStore } from '../../../expenses/services/expense-store';
import { Pageable } from '../../../hateoas/hateoas-models';
import { SecurityStore } from '../../../security/services/security-store';
import { TripStore } from '../../services/trip-store';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-details.html',
  styleUrl: './trip-details.css',
})
export class TripDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly security = inject(SecurityStore);
  public readonly store = inject(TripStore);
  public readonly expenses = inject(ExpenseStore);
  public readonly router = inject(Router);

  public expensePageable: Pageable = { page: 0, size: 10, sort: 'date,desc' };
  public recPageable: Pageable = { page: 0, size: 6, sort: 'id,asc' };

  public tripId: number | null = null;
  public currentTrip$ = this.store.currentTrip;
  public recommendations = this.store.recommendations;
  public calculations = this.expenses.calculations;

  showFiltered = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.tripId = +id;
      this.store.loadTripById(this.tripId);
      this.loadExpenses();
      this.loadTripExpenses();
      this.loadRecommendations();
    }
  }

  loadRecommendations(): void {
    const userId = this.security.auth().userId;
    if (this.tripId && userId) {
      this.store.loadRecommendations(this.tripId, userId, this.recPageable);
    }
  }

  toggleFilter(): void {
    const userId = this.security.auth().userId;
    if (!this.tripId || !userId) return;

    if (this.showFiltered()) {
      this.showFiltered.set(false);
      this.store.loadRecommendations(this.tripId, userId, this.recPageable);
    } else {
      this.showFiltered.set(true);
      this.store.loadFilteredRecommendations(this.tripId, userId, this.recPageable);
    }
  }

  loadTripExpenses() {
    if (this.tripId !== null) {
      this.expenses.loadTotalExpensesByTrip(this.tripId);
      this.expenses.loadAverageExpensesByTrip(this.tripId);
    }
  }

  loadExpenses() {
    if (this.tripId !== null) {
      this.expenses.loadExpensesByTripId(this.tripId, this.expensePageable);
    }
  }

  onDeleteTrip(): void {
    if (this.tripId && confirm('¿Eliminar viaje completo?')) {
      this.store.deleteTrip(this.tripId).subscribe({
        next: () => this.router.navigate(['/trips']),
      });
    }
  }

  get name() {
    return this.currentTrip$()?.name;
  }
}
