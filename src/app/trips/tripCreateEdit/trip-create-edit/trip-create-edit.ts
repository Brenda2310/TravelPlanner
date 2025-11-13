import { Component, effect, inject, OnInit } from '@angular/core';
import { TripStore } from '../../services/trip-store';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TripValidation } from '../../validations/TripValidation';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, Observable, take } from 'rxjs';
import { TripCreateDTO, TripResponseDTO, TripUpdateDTO } from '../../trip-models';
import { SecurityStore } from '../../../security/services/security-store';

@Component({
  selector: 'app-trip-create-edit',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './trip-create-edit.html',
  styleUrl: './trip-create-edit.css',
})
export class TripCreateEdit implements OnInit {
  public readonly store = inject(TripStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly security = inject(SecurityStore);

  public tripId: number | undefined;
  public isEditing: boolean = false;
  public loading: boolean = false;
  public errorMessage: string | null = null;

  newUserId: number | null = null;

  private tripDetail$ = this.store.currentTrip;

  public tripForm = this.fb.group(
    {
      name: ['', [Validators.required, Validators.maxLength(100)]],
      destination: ['', [Validators.required, Validators.maxLength(100)]],
      estimatedBudget: [null as number | null,
      [Validators.required, Validators.min(0)]],
      companions:[new FormControl<number | null>(null), [TripValidation.optionalMinValidator(0)]],

      startDate: ['', [Validators.required]],
      endDate: ['', Validators.required],

      sharedUserIds: [[] as number[]],
      newUserId: [''],
    },
    {
      validators: TripValidation.dateRangeValidator,
    }
  );

  // Usamos un effect() para reaccionar automáticamente a los cambios en la señal currentTrip del store.
  // Cuando el store carga los datos del viaje (por ejemplo, al editar), el effect detecta ese cambio y actualiza
  // el formulario con los valores del viaje correspondiente. Así evitamos tener que suscribirnos manualmente
  // con toObservable() y manejar el ciclo de vida de la suscripción.

  public readonly patchEffect = effect(() => {
    const trip = this.store.currentTrip();
    if (trip && trip.id === this.tripId) {
      console.log('🌀 Parchando formulario con datos del viaje:', trip);
      this.tripForm.patchValue({
        name: trip.name,
        destination: trip.destination,
        estimatedBudget: trip.estimatedBudget,
        companions: trip.companions,
        startDate: trip.startDate,
        endDate: trip.endDate,
        sharedUserIds: trip.userIds.filter((id) => id !== this.security.getId()),
      });
    }
  });
  

  ngOnInit(): void {
    const idFromUrl = this.route.snapshot.paramMap.get('id');

    if (idFromUrl) {
      this.tripId = +idFromUrl;
      this.isEditing = true;

      this.store.loadTripById(this.tripId);
    }
  }

  /*
  private handleDataPatching(): void {
    toObservable(this.tripDetail$)
      .pipe(take(1))
      .subscribe((trip) => {
        if (trip && trip.id === this.tripId) {
          this.tripForm.patchValue({
            name: trip.name,
            destination: trip.destination,
            estimatedBudget: trip.estimatedBudget,
            companions: trip.companions,
            startDate: trip.startDate,
            endDate: trip.endDate,
            sharedUserIds: trip.userIds.filter((id) => id !== this.security.getId()),
          });
        }
      });
  }*/


  onSubmit(): void {
    if (this.tripForm.invalid) {
      this.tripForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValue = this.tripForm.value;

    const companionsValue = formValue.companions as any;

    if (companionsValue === '' || companionsValue === undefined || isNaN(Number(companionsValue))) {
      formValue.companions = null;
    }


    let action$: Observable<any>;

    const tripDto = {
      name: formValue.name!,
      destination: formValue.destination!,
      estimatedBudget: formValue.estimatedBudget!,
      companions: formValue.companions!,
      startDate: formValue.startDate!,
      endDate: formValue.endDate || undefined,
    };

    if (this.isEditing) {
      const updateDto: TripUpdateDTO = tripDto;
      action$ = this.store.updateTrip(this.tripId!, updateDto);
    } else {
      const createDto: TripCreateDTO = {
        ...tripDto,
        sharedUserIds: formValue.sharedUserIds!,
      } as TripCreateDTO;
      action$ = this.store.createTrip(createDto);
    }

    action$.subscribe({
      next: () => {
        alert('Viaje Guardado con exito');
        this.router.navigate(['/trips']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al guardar el viaje.';
        this.loading = false;
      },
    });
  }

  get sharedUserIdsArray(): number[] {
    return this.tripForm.get('sharedUserIds')?.value || [];
  }

  addUserId() {
    const userIdControl = this.tripForm.get('newUserId');
    const sharedIdsControl = this.tripForm.get('sharedUserIds');
    const idToAdd = userIdControl?.value ? parseInt(userIdControl.value, 10) : null;
    const currentUserId = this.security.getId();

    if (idToAdd && !isNaN(idToAdd) && idToAdd !== currentUserId) {
      const currentSharedIds: number[] = sharedIdsControl?.value || [];

      if (!currentSharedIds.includes(idToAdd)) {
        sharedIdsControl?.setValue([...currentSharedIds, idToAdd]);
      }

      userIdControl?.reset();
    }
  }

  removeUserId(idToRemove: number) {
    const sharedIdsControl = this.tripForm.get('sharedUserIds');
    const currentSharedIds: number[] = sharedIdsControl?.value || [];

    const newSharedIds = currentSharedIds.filter((id) => id !== idToRemove);
    sharedIdsControl?.setValue(newSharedIds);
  }


}
