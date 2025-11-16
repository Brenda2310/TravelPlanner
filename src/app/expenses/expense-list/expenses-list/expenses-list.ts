import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Pagination } from '../../../hateoas/Pagination/pagination/pagination';
import { ExpenseStore } from '../../services/expense-store';
import { SecurityStore } from '../../../security/services/security-store';
import { TripStore } from '../../../trips/services/trip-store';
import { Pageable } from '../../../hateoas/hateoas-models';
import { ExpenseCategory, ExpenseFilterDTO } from '../../expense-models';
import { filter } from 'rxjs';
import { routes } from '../../../app.routes';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-expenses-list',
  imports: [ReactiveFormsModule, RouterLink, Pagination, DecimalPipe],
  templateUrl: './expenses-list.html',
  styleUrl: './expenses-list.css',
})
export class ExpensesList implements OnInit {
  public readonly store = inject(ExpenseStore);
  private readonly security = inject(SecurityStore);
  private readonly formBuilder = inject(FormBuilder);
  protected readonly tripStore = inject(TripStore);
  private readonly router = inject(Router);

  public pageable: Pageable = { page: 0, size: 9, sort: 'date,asc' };
  public readonly categories: ExpenseCategory[] = [
    'TRANSPORTE',
    'ALOJAMIENTO',
    'COMIDA',
    'ACTIVIDADES',
    'SOUVENIRS',
    'TICKETS',
    'INESPERADO',
    'SALUD',
    'COMUNICACION',
    'OTROS',
  ];

  public filtersForm = this.formBuilder.group({
    category: [''],
    startDate: [''],
    endDate: [''],
    tripId: ['']
  });

  ngOnInit(): void {
      const userId = this.security.getId();
    if (userId) {
      this.tripStore.loadTripsByUserId(
      userId,
      {},                    
      { page: 0, size: 100 }  
    );
      this.store.loadExpensesByUserId(userId, {}, { page: 0, size: 100 } as Pageable);
      this.store.loadAverageExpensesByUser(userId);
      this.store.loadRealAverageExpenseByUser(userId);
      this.store.loadTotalRealExpensesByUser(userId);
    }
    this.loadExpenses();
    this.loadMetrics();
  }

  loadExpenses(): void {
      const userId = this.security.getId();
      if (!userId) {
        console.error('Usuario no autenticado para cargar las expensas.');
        return;
      }

      const filters: ExpenseFilterDTO = this.filtersForm.value as ExpenseFilterDTO;
      this.store.loadExpensesByUserId(userId, filters, this.pageable);
  }

  onApplyFilters(): void {
    this.pageable.page = 0;
    this.loadExpenses();
    this.loadMetrics();
  }

  onPageChange(newPage: number): void {
    this.pageable.page = newPage;
    this.loadExpenses();
  }

  onDelete(id: number): void {
  if (confirm('¿Desea eliminar el gasto?')) {
    this.store.deleteExpense(id).subscribe({
      next: () => {
        this.loadMetrics();
      },
      error: (err) => {
        console.error('Error al eliminar el gasto: ', err);
      },
    });
  }
}


  toDetails(id: number): void {
    this.router.navigateByUrl(`/expenses/${id}`);
  }

  clearFilters(): void {
    this.filtersForm.reset({ category: '', startDate: '', endDate: '' });
    this.pageable.page = 0;
    this.loadExpenses();
    this.loadMetrics();
  }

  private loadMetrics(): void {
  const userId = this.security.getId();
  if (!userId) return;

  const filters = this.filtersForm.value as any;
  const tripId = filters.tripId ? Number(filters.tripId) : null;

  if (tripId) {
    this.store.loadAverageExpensesByTrip(tripId);
    this.store.loadTotalExpensesByTrip(tripId);   
  } else {
    this.store.loadAverageExpensesByUser(userId);
    this.store.loadRealAverageExpenseByUser(userId);
    this.store.loadTotalRealExpensesByUser(userId);
  }
}

}
