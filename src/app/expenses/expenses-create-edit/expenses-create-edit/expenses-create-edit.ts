import { ChangeDetectorRef, Component, effect, inject, OnInit } from '@angular/core';
import { ExpenseStore } from '../../services/expense-store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TripStore } from '../../../trips/services/trip-store';
import { SecurityStore } from '../../../security/services/security-store';
import { Pageable } from '../../../hateoas/hateoas-models';
import { ExpenseCategory, ExpenseCreateDTO, ExpenseUpdateDTO } from '../../expense-models';
import { finalize, Observable } from 'rxjs';

@Component({
  selector: 'app-expenses-create-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './expenses-create-edit.html',
  styleUrl: './expenses-create-edit.css'
})
export class ExpensesCreateEdit implements OnInit{

  private readonly store = inject(ExpenseStore);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly tripStore = inject(TripStore);
  private readonly securityStore = inject(SecurityStore);
  private readonly cdr = inject(ChangeDetectorRef);

  public isEditing = false;
  public loading = false;
  public errorMessage: string | null = null;
  public expenseId: number | undefined;
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
    'OTROS'
  ];


  public userTrips = this.tripStore.trips;

  public expenseForm = this.formBuilder.group({
    category: [null as ExpenseCategory | null, [Validators.required]], 
    description: [""], 
    amount: [null as number | null, [Validators.required, Validators.min(1)]], 
    date: ["", [Validators.required]], 
    sharedUserIds: [[] as number[]], 
    tripId: [null as number | null, [Validators.required]], 


     newUserId: ['']
  });

  public effect = effect(() => {
    const expense = this.store.currentExpenseDetail();
    const isEditing = this.isEditing; 

    if (!isEditing) return;

    if(expense){
      this.expenseForm.patchValue({
        category: expense.category as ExpenseCategory, 
        description: expense.description, 
        amount: expense.amount,
        date: expense.date, 
        sharedUserIds: expense.userIds ?? [], 
        tripId: expense.tripId
      });
    }
  });

  ngOnInit(): void {
    
    const idFromUrl = this.route.snapshot.paramMap.get("id");

    if(idFromUrl){
      this.expenseId = +idFromUrl;
      this.isEditing = true;
      this.store.loadExpenseById(this.expenseId);
    }

    const userId = this.securityStore.getId();
    if(userId){
      this.tripStore.loadTripsByUserId(userId, {}, { page: 0, size: 9 } as Pageable);
    }
  }

  selectTrip(tripId: number): void{
    this.expenseForm.patchValue({ tripId });
  }

  isSelected(tripId: number): boolean {
    return this.expenseForm.get('tripId')?.value === tripId;
  }

  onSubmit(): void{
    if(this.expenseForm.invalid){
      this.expenseForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const formValue = this.expenseForm.getRawValue();

    const dto: ExpenseCreateDTO = {
      category: formValue.category!, 
      description: formValue.description!, 
      amount: formValue.amount!, 
      date: formValue.date!, 
      sharedUserIds: formValue.sharedUserIds ?? [], 
      tripId: formValue.tripId!
    };

    let action$: Observable<any>;

    if(this.isEditing){
      action$ = this.store.updateExpense(this.expenseId!, dto as ExpenseUpdateDTO);
    }else{
      action$ = this.store.createExpense(dto);
    }

    const observable$ = action$.pipe(
          finalize(() => {
            this.loading = false;
            this.cdr.detectChanges();
          })
        );

    action$.subscribe({
      next: () => {
        alert(`Gasto ${this.isEditing ? 'actualizado' : 'creado'} con exito.`);
        this.router.navigateByUrl("/expenses");
        this.cdr.detectChanges();
      }, 
      error: (err: any) => {
        this.loading = false;

        console.error('Error del Store:', err);

        this.errorMessage =
          err.userMessage ||
          err.original?.error?.message ||
          err.original?.message ||
          err.original?.toString() ||
          'Error desconocido.';
          this.cdr.detectChanges();
      },
    });
  }

  get sharedUserIdsArray(): number[] {
    return this.expenseForm.get('sharedUserIds')?.value || [];
  }

  addUserId() {
    const userIdControl = this.expenseForm.get('newUserId');
    const sharedIdsControl = this.expenseForm.get('sharedUserIds');
    const idToAdd = userIdControl?.value ? parseInt(userIdControl.value, 10) : null;
    const currentUserId = this.securityStore.getId();

    if (idToAdd && !isNaN(idToAdd) && idToAdd !== currentUserId) {
      const currentSharedIds: number[] = sharedIdsControl?.value || [];

      if (!currentSharedIds.includes(idToAdd)) {
        sharedIdsControl?.setValue([...currentSharedIds, idToAdd]);
      }

      userIdControl?.reset();
    }
  }

  removeUserId(idToRemove: number) {
    const sharedIdsControl = this.expenseForm.get('sharedUserIds');
    const currentSharedIds: number[] = sharedIdsControl?.value || [];

    const newSharedIds = currentSharedIds.filter((id) => id !== idToRemove);
    sharedIdsControl?.setValue(newSharedIds);
  }


}
