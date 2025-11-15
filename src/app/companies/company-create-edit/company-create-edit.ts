import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyStore } from '../services/company-store';
import { SecurityStore } from '../../security/services/security-store';
import { PasswordValidators } from '../../users/validators/PasswordValidators';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, finalize, Observable, take } from 'rxjs';
import { CompanyCreateDTO, CompanyUpdateDTO } from '../company-models';

@Component({
  selector: 'app-company-create-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './company-create-edit.html',
  styleUrl: './company-create-edit.css',
})
export class CompanyCreateEdit implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  public readonly store = inject(CompanyStore);
  public readonly security = inject(SecurityStore);
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() companyId?: number;
  @Input() mode: 'create' | 'edit-admin' = 'create';

  public loading = false;
  public errorMessage: string | null = null;
  public currentCompany$ = toObservable(this.store.currentCompany);

  public profileForm = this.fb.group(
    {
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, PasswordValidators.strongPassword]],
      confirmPassword: ['', [Validators.required]],
      taxId: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
      location: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{7,14}$/)]],
      description: ['', [Validators.required]],
    },
    {
      validators: PasswordValidators.match('password', 'confirmPassword'),
    }
  );

  ngOnInit(): void {
    const idFromUrl = this.route.snapshot.paramMap.get('id');
    this.companyId = this.companyId ?? (idFromUrl ? +idFromUrl : undefined);

    if (this.companyId) {
      this.mode = 'edit-admin';
      this.loadCompanyData();
      this.removePasswordValidatorsForEdit();
     // this.cdr.detectChanges();
    }
  }

  private removePasswordValidatorsForEdit(): void {
    this.profileForm.get('password')?.setValidators([PasswordValidators.strongPassword]);

    this.profileForm.get('confirmPassword')?.setValidators(null);
    this.profileForm.removeValidators(PasswordValidators.match('password', 'confirmPassword'));

    this.profileForm.get('password')?.updateValueAndValidity();
    this.profileForm.get('confirmPassword')?.updateValueAndValidity();
    this.profileForm.updateValueAndValidity();
  }

  private loadCompanyData(): void {
    if (!this.companyId) return;

    this.store.loadCompanyById(this.companyId);

    this.currentCompany$
      .pipe(
        filter((c) => !!c && c.id === this.companyId),
        take(1)
      )
      .subscribe((company) => {
        if (!company) return;
        const patchData: CompanyUpdateDTO = {
          username: company.username || '',
          email: (company as any).email || '',
          taxId: company.taxId || '',
          location: company.location || '',
          phone: company.phone || '',
          description: company.description || '',
        };

        this.profileForm.patchValue(patchData);
        this.profileForm.get('taxId')?.disable();
      });
  }

  onSubmit(): void {
    if (this.mode !== 'create') {
      const passwordControl = this.profileForm.get('password');
      if (passwordControl?.value) {
        passwordControl.setValidators([Validators.required, PasswordValidators.strongPassword]);
        this.profileForm.get('confirmPassword')?.setValidators(Validators.required);
        this.profileForm.setValidators(PasswordValidators.match('password', 'confirmPassword'));
      } else {
        passwordControl?.setErrors(null);
      }
      this.profileForm.updateValueAndValidity();
    }

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValue = this.profileForm.getRawValue();

    const baseDto = {
      username: formValue.username!,
      email: formValue.email!,
      taxId: formValue.taxId!,
      location: formValue.location!,
      phone: formValue.phone!,
      description: formValue.description!,
    };

    if (formValue.password) {
      (baseDto as any).password = formValue.password;
    }

    let action$: Observable<any>;

    if (this.mode === 'create') {
      action$ = this.store.createCompany(baseDto as CompanyCreateDTO);
    } else {
      action$ = this.store.updateCompany(this.companyId!, baseDto as CompanyUpdateDTO);
    }

    const observable$ = action$.pipe(
          finalize(() => {
            this.loading = false;
            this.cdr.detectChanges();
          })
        );

    action$.subscribe({
      next: () => {
        alert(`Compañía ${this.mode === 'create' ? 'registrada' : 'actualizada'} con éxito.`);
        this.router.navigate(['/companies']);
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
