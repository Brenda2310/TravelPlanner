import { Component, inject, OnInit } from '@angular/core';
import { TripStore } from '../../services/trip-store';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TripValidation } from '../../validations/TripValidation';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, Observable, take } from 'rxjs';
import { TripCreateDTO, TripUpdateDTO } from '../../trip-models';
import { SecurityStore } from '../../../security/services/security-store';

@Component({
  selector: 'app-trip-create-edit',
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
      estimatedBudget: [0, [Validators.required, Validators.min(0)]],
      companions: [0, [Validators.required, Validators.min(0)]],

      startDate: ['', [Validators.required]],
      endDate: [''],

      sharedUserIds: [[] as number[]],
      newUserId: [''],
    },
    {
      validators: TripValidation.dateRangeValidator,
    }
  );

  ngOnInit(): void {
    const idFromUrl = this.route.snapshot.paramMap.get('id');

    if (idFromUrl) {
      this.tripId = +idFromUrl;
      this.isEditing = true;
      this.store.loadTripById(this.tripId);
      this.handleDataPatching();
    }
  }

  private handleDataPatching(): void {
    toObservable(this.tripDetail$)
      .pipe(
        filter((trip) => !!trip && trip.id === this.tripId),
        take(1)
      )
      .subscribe((trip) => {
        if (trip) {
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
  }

  onSubmit(): void {
    if (this.tripForm.invalid) {
      this.tripForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValue = this.tripForm.value;
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
