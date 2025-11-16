import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChecklistStore } from '../services/checklist-store';
import { ChecklistService } from '../services/checklist-service';
import { ActivatedRoute, Router } from '@angular/router';
import { TripStore } from '../../trips/services/trip-store';
import { SecurityStore } from '../../security/services/security-store';
import { finalize, Observable } from 'rxjs';
import { CheckListCreateDTO, CheckListUpdateDTO } from '../checklist-models';
import { Pageable } from '../../hateoas/hateoas-models';

@Component({
  selector: 'app-checklist-create-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checklist-create-edit.html',
  styleUrl: './checklist-create-edit.css'
})
export class ChecklistCreateEdit implements OnInit{

  private readonly store = inject(ChecklistStore);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly tripStore = inject(TripStore);
  private readonly securityStore = inject(SecurityStore);
  private readonly cdr = inject(ChangeDetectorRef);

  public isEditing = false;
  public loading = false;
  public errorMessage: string | null = null;
  public checklistId: number | undefined;

  public userTrips = this.tripStore.trips;

  public checklistForm = this.formBuilder.group ({
    name: ["", [Validators.required, Validators.maxLength(50)]], 
    tripId: [null as (number | null), [Validators.required, Validators.min(1)]], 
    items: this.formBuilder.array([])
  });


  public effect = effect(() => {
    const checklist = this.store.currentChecklist();
    const isEditing = this.isEditing;

    if (!isEditing || !checklist) return;

    if (checklist) {
      this.checklistForm.patchValue({
        name: checklist.name,
        tripId: checklist.tripId
      });
    }
  });

  ngOnInit(): void {
    const idFromUrl = this.route.snapshot.paramMap.get('id');

    if (idFromUrl) {
      this.checklistId = +idFromUrl;
      this.isEditing = true;
      this.store.loadChecklistById(this.checklistId);
    }

    const userId = this.securityStore.getId();
    if (userId) {
      this.tripStore.loadTripsByUserId(userId, {}, { page: 0, size: 10 } as Pageable);
    }
  
  }

  selectTrip(tripId: number): void{
    this.checklistForm.patchValue({ tripId });
  }

  isSelected(tripId: number): boolean{
    return this.checklistForm.get('tripId')?.value === tripId;
  }

  onSubmit(): void{
    if(this.checklistForm.invalid){
      this.checklistForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const checklist = this.checklistForm.getRawValue();
    let action$: Observable<any>;

    const dto = {
      name: checklist.name!, 
      tripId: checklist.tripId!
    };

    if(this.isEditing){
      action$ = this.store.update(this.checklistId!, dto as CheckListUpdateDTO);
    } else {
      action$ = this.store.create(dto as CheckListCreateDTO);
    }

    const observable$ = action$.pipe(
          finalize(() => {
            this.loading = false;
            this.cdr.detectChanges();
          })
        );

    observable$.subscribe({
      next: () => {
        alert(`Checklist ${this.isEditing ? 'actualizada' : 'creada'} con exito.`);
        this.router.navigateByUrl("/checklists");
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
