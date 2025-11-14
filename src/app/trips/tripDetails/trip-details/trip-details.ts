import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TripStore } from '../../services/trip-store';
import { ExpenseStore } from '../../../expenses/services/expense-store';
import { Pageable } from '../../../hateoas/hateoas-models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-details.html',
  styleUrl: './trip-details.css',
})
export class TripDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  public readonly store = inject(TripStore);
  public readonly expenses = inject(ExpenseStore);
  public readonly router = inject(Router);

  public expensePageable: Pageable = { page: 0, size: 10, sort: 'date,desc' };

  public tripId: number | null = null;
  public currentTrip$ = this.store.currentTrip;

  public calculations = this.expenses.calculations;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.tripId = +id;
      this.store.loadTripById(this.tripId);
      this.loadExpenses();
      this.loadTripExpenses();
    }
  }

  loadTripExpenses (){
    if(this.tripId!==null){
      this.expenses.loadTotalExpensesByTrip(this.tripId);
      this.expenses.loadAverageExpensesByTrip(this.tripId);
    }
  }

  loadExpenses(){
    if(this.tripId !== null){
      this.expenses.loadExpensesByTripId(this.tripId, this.expensePageable);
    }
  }

  onExpensePageChange(newPage: number): void {
    if (this.tripId !== null) {
      this.expensePageable.page = newPage;
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

  get name(){
    return this.currentTrip$()?.name;
  }
}
