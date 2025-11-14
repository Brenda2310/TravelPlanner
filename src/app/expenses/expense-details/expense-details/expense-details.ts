import { Component, effect, inject } from '@angular/core';
import { ExpenseStore } from '../../services/expense-store';
import { ActivatedRoute, Router } from '@angular/router';
import { TripStore } from '../../../trips/services/trip-store';

@Component({
  selector: 'app-expense-details',
  imports: [],
  templateUrl: './expense-details.html',
  styleUrl: './expense-details.css'
})
export class ExpenseDetails {

    public readonly store = inject(ExpenseStore);
    public readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly trips = inject(TripStore);
  
    public expenseId: number | null = null;
    public currentExpense$ = this.store.currentExpenseDetail;
    public currentTrip$ = this.trips.currentTrip;
  
    ngOnInit(): void{
      const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          this.expenseId = +id;
          this.store.loadExpenseById(this.expenseId);
      }
    }
  
    private readonly loadTripEffect = effect(() => {
      const expense = this.currentExpense$();
      if (expense) {
        this.trips.loadTripById(expense.tripId);
      }
    });
  
    onDeleteExpense(): void {
        if (this.expenseId && confirm('¿Desea eliminar este gasto?')) {
          this.store.deleteExpense(this.expenseId).subscribe({
            next: () => this.router.navigateByUrl('expenses'),
          });
        }
      }
  
    toEdit(id: number){
      this.router.navigateByUrl(`/expenses/${id}/edit`);
    }

    toTrip(tripId: number) {
      this.router.navigateByUrl(`/trips/${tripId}`);
    }

}

