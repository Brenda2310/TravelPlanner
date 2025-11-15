import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivityStore } from '../services/activity-store';
import { SecurityStore } from '../../security/services/security-store';
import {
  ActivityCategory,
  CompanyActivityCreateDTO,
  UserActivityCreateDTO,
} from '../activity-models';
import { finalize, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activity-create-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './activity-create-edit.html',
  styleUrl: './activity-create-edit.css',
})
export class ActivityCreateEdit implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(ActivityStore);
  private readonly security = inject(SecurityStore);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() mode: 'user' | 'company' | 'edit' = 'user';
  @Input() activityId?: number;

  public loading: boolean = false;
  public errorMessage: string | null = null;
  public readonly categories: ActivityCategory[] = [
    'AVENTURA',
    'CULTURA',
    'RELAX',
    'GASTRONOMIA',
    'NATURALEZA',
    'NIGHTLIFE',
    'SHOPPING',
    'DEPORTES',
    'HISTORIA',
    'FAMILIA',
  ];

  public activityForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    category: ['', [Validators.required]],
    date: ['', [Validators.required]],
    startTime: ['', [Validators.required]],
    endTime: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],

    available_quantity: [null as number | null],
    sharedUserIds: [[] as number[]],
    newUserId: [''],
  });

  ngOnInit(): void {
    if (this.security.auth().isCompany) {
      this.mode = 'company';
    } else {
      this.mode = 'user';
    }

    this.setConditionalValidators();
  }

  private setConditionalValidators(): void {
    const quantityControl = this.activityForm.get('available_quantity');

    if (this.mode === 'company') {
      quantityControl?.addValidators(Validators.required);
    } else {
      quantityControl?.clearValidators();
    }
    quantityControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    const formValue = this.activityForm.value;
    let action$: Observable<any>;

    const baseActivityDto = {
      name: formValue.name!,
      description: formValue.description!,
      category: formValue.category!,
      date: formValue.date!,
      startTime: formValue.startTime!,
      endTime: formValue.endTime!,
      price: formValue.price!,
    };
    if (this.mode === 'company') {
      const companyDto: CompanyActivityCreateDTO = {
        ...baseActivityDto,
        companyId: this.security.auth().userId,
        available_quantity: formValue.available_quantity!,
      } as CompanyActivityCreateDTO;
      action$ = this.store.createActivityFromCompany(companyDto);
    } else {
      const userDto: UserActivityCreateDTO = {
        ...baseActivityDto,
        sharedUserIds: formValue.sharedUserIds!,
      } as UserActivityCreateDTO;
      action$ = this.store.createFromUser(userDto, { page: 0, size: 10 });
    }

    const observable$ = action$.pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    );

    observable$.subscribe({
      next: () => {
        alert('Actividad guardada con éxito.');
        this.router.navigateByUrl('/activities');
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
    return this.activityForm.get('sharedUserIds')?.value || [];
  }

  addUserId() {
    const userIdControl = this.activityForm.get('newUserId');
    const sharedIdsControl = this.activityForm.get('sharedUserIds');
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
    const sharedIdsControl = this.activityForm.get('sharedUserIds');
    const currentSharedIds: number[] = sharedIdsControl?.value || [];

    const newSharedIds = currentSharedIds.filter((id) => id !== idToRemove);
    sharedIdsControl?.setValue(newSharedIds);
  }
}
