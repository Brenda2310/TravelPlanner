import { ChangeDetectorRef, Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItineraryStore } from '../services/itinerary-store';
import { SecurityStore } from '../../security/services/security-store';
import { filter, finalize, Observable, take } from 'rxjs';
import { ItineraryCreateDTO, ItineraryUpdateDTO } from '../itinerary-models';
import { TripStore } from '../../trips/services/trip-store';
import { Pageable } from '../../hateoas/hateoas-models';
import { DateValidator } from '../validators/DateValidator';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-itinerary-create-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './itinerary-create-edit.html',
  styleUrl: './itinerary-create-edit.css',
})
export class ItineraryCreateEdit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(ItineraryStore);
  private readonly tripStore = inject(TripStore);
  private readonly securityStore = inject(SecurityStore);
  private currentItinerary$ = toObservable(this.store.currentItinerary);
  private readonly cdr = inject(ChangeDetectorRef);

  public isEditing: boolean = false;
  public loading: boolean = false;
  public errorMessage: string | null = null;
  public itineraryId: number | undefined;

  public userTrips = this.tripStore.trips;

  public itineraryForm = this.fb.group(
    {
      itineraryDate: ['', [Validators.required]],
      notes: [''],
      tripId: [null as number | null, [Validators.required, Validators.min(1)]],
    },
    {
      validators: [DateValidator.dateWithinTripRange(this.tripStore, 'itineraryDate', 'tripId')],
    }
  );

  ngOnInit(): void {
    const idFromUrl = this.route.snapshot.paramMap.get('id');

    if (idFromUrl) {
      this.itineraryId = +idFromUrl;
      this.isEditing = true;
      this.store.loadItineraryById(this.itineraryId);

      this.handleDataPatching(this.currentItinerary$);
    }

    const userId = this.securityStore.getId();
    if (userId) {
      this.tripStore.loadTripsByUserId(userId, {}, { page: 0, size: 9 } as Pageable);
    }
  }

  private handleDataPatching(dataObservable: Observable<any>): void {
    dataObservable
      .pipe(
        filter((itinerary): itinerary is any => !!itinerary),
        take(1)
      )
      .subscribe((itinerary) => {
        this.itineraryForm.patchValue({
          itineraryDate: itinerary.itineraryDate,
          notes: itinerary.notes,
          tripId: itinerary.trip?.id || itinerary.tripId || null,
        });

        this.itineraryForm.get('tripId')?.disable();
      });
  }

  selectTrip(tripId: number): void {
    this.itineraryForm.patchValue({ tripId });
  }

  isSelected(tripId: number): boolean {
    return this.itineraryForm.get('tripId')?.value === tripId;
  }

  onSubmit(): void {
    if (this.itineraryForm.invalid) {
      this.itineraryForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const formValue = this.itineraryForm.getRawValue();
    let action$: Observable<any>;

    if (this.isEditing) {
      const dto: ItineraryUpdateDTO = {
        itineraryDate: formValue.itineraryDate!,
        notes: formValue.notes!,
      };

      action$ = this.store.updateItinerary(this.itineraryId!, dto);
    } else {
      const dto: ItineraryCreateDTO = {
        itineraryDate: formValue.itineraryDate!,
        notes: formValue.notes!,
        tripId: Number(formValue.tripId!),
      };

      action$ = this.store.createItinerary(dto);
    }

    const observable$ = action$.pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    );

    observable$.subscribe({
      next: () => {
        alert(`Itinerario ${this.isEditing ? 'actualizado' : 'creado'} con éxito.`);
        this.router.navigate(['/itineraries']);
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
}
