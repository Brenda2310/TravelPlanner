import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItineraryStore } from '../services/itinerary-store';
import { SecurityStore } from '../../security/services/security-store';
import { Observable } from 'rxjs';
import { ItineraryCreateDTO, ItineraryUpdateDTO } from '../itinerary-models';
import { TripStore } from '../../trips/services/trip-store';
import { Pageable } from '../../hateoas/hateoas-models';
import { DateValidator } from '../validators/DateValidator';

@Component({
  selector: 'app-itinerary-create-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './itinerary-create-edit.html',
  styleUrl: './itinerary-create-edit.css'
})
export class ItineraryCreateEdit {
  private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly store = inject(ItineraryStore);
    private readonly tripStore = inject(TripStore);
    private readonly securityStore = inject(SecurityStore);

    public isEditing: boolean = false;
    public loading: boolean = false;
    public errorMessage: string | null = null;
    public itineraryId: number | undefined;

    public userTrips = this.tripStore.trips;

    public itineraryForm = this.fb.group({
        itineraryDate: ['', [Validators.required]],
        notes: [''], 
        tripId: [null as (number | null), [Validators.required, Validators.min(1)]] 
    }, {
        validators: [DateValidator.dateWithinTripRange(this.tripStore, 'itineraryDate', 'tripId')]
    });

    ngOnInit(): void {
        const idFromUrl = this.route.snapshot.paramMap.get('id');
        
        if (idFromUrl) {
            this.itineraryId = +idFromUrl;
            this.isEditing = true;
            this.store.loadItineraryById(this.itineraryId);
        }

        const userId = this.securityStore.getId();
        if (userId) {
        this.tripStore.loadTripsByUserId(userId, {}, { page: 0, size: 10 } as Pageable);
        }

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
        
        const dto = {
            itineraryDate: formValue.itineraryDate!,
            notes: formValue.notes,
            tripId: Number(formValue.tripId!), 
        };


        console.log('DTO enviado al backend:', dto);

        if (this.isEditing) {
            action$ = this.store.updateItinerary(this.itineraryId!, dto as ItineraryUpdateDTO);
        } else {
            action$ = this.store.createItinerary(dto as ItineraryCreateDTO);
        }

        action$.subscribe({
            next: () => {
                alert(`Itinerario ${this.isEditing ? 'actualizado' : 'creado'} con éxito.`);
                this.router.navigate(['/itineraries']); 
            },
            error: (err) => {
                this.errorMessage = err.error?.message || 'Error al guardar el itinerario.';
                this.loading = false;
            }
        });
    }
}

