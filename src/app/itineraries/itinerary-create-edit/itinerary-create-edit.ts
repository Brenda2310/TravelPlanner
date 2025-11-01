import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItineraryStore } from '../services/itinerary-store';
import { SecurityStore } from '../../security/services/security-store';
import { Observable } from 'rxjs';
import { ItineraryCreateDTO, ItineraryUpdateDTO } from '../itinerary-models';

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
    private readonly securityStore = inject(SecurityStore);

    public isEditing: boolean = false;
    public loading: boolean = false;
    public errorMessage: string | null = null;
    public itineraryId: number | undefined;

    public itineraryForm = this.fb.group({
        itineraryDate: ['', [Validators.required]],
        notes: [''], 
        tripId: [null as (number | null), [Validators.required, Validators.min(1)]] 
    });

    ngOnInit(): void {
        const idFromUrl = this.route.snapshot.paramMap.get('id');
        
        if (idFromUrl) {
            this.itineraryId = +idFromUrl;
            this.isEditing = true;
            this.store.loadItineraryById(this.itineraryId);
        }
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
            tripId: formValue.tripId!, 
        };

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
