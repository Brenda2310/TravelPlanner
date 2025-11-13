import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyStore } from '../services/company-store';
import { SecurityStore } from '../../security/services/security-store';
import { CompanyUpdateDTO } from '../company-models';
import { PasswordValidators } from '../../users/validators/PasswordValidators';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './company-profile.html',
  styleUrl: './company-profile.css'
})
export class CompanyProfile implements OnInit{
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  public readonly store = inject(CompanyStore);
  public readonly security = inject(SecurityStore);

  public companyId: number | null = null;
  public loading: boolean = false;
  public errorMessage: string | null = null;

  public currentProfile = this.store.currentCompany; 
  public currentProfile$ = toObservable(this.store.currentCompany);

    public profileForm = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
        email: ['', [Validators.required, Validators.email]],
        password: [''], 
        confirmPassword: [''], 
        taxId: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
        location: [''],
        phone: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{7,14}$/)]],
        description: [''],
    }, {
        validators: PasswordValidators.match('password', 'confirmPassword')
    });

    ngOnInit(): void {
        this.store.loadProfile();
        
        this.currentProfile$.pipe(
            filter(c => !!c),
            take(1)
        ).subscribe(company => {
            if (company) {
                this.companyId = company.id;
                this.profileForm.patchValue(company);
                
                this.profileForm.get('taxId')?.disable(); 
            }
        });
        this.removePasswordValidators();
    }
    
    private removePasswordValidators(): void {
        this.profileForm.get('password')?.setValidators([/* Validators de fortaleza */]);
        this.profileForm.get('confirmPassword')?.setValidators(null);
        this.profileForm.removeValidators(PasswordValidators.match('password', 'confirmPassword'));
        this.profileForm.updateValueAndValidity();
    }


    onSubmit(): void {
        if (this.profileForm.invalid) {
            this.profileForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        const formValue = this.profileForm.getRawValue();
        
        const updateDto: CompanyUpdateDTO = formValue as CompanyUpdateDTO;
        
        this.store.updateCompany(this.companyId!, updateDto).subscribe({
            next: () => {
                alert('Perfil de Compañía actualizado con éxito.');
                this.loading = false;
            },
            error: (err) => {
                this.errorMessage = err.error?.message || 'Error al actualizar el perfil.';
                this.loading = false;
            }
        });
    }
    
    onDeleteOwnAccount(): void {
        if (confirm('¿Confirmar borrado de su cuenta de compañía?')) {
            this.store.deleteOwnCompany().subscribe({
                next: () => {
                    alert('Cuenta eliminada. Redirigiendo a Login.');
                    this.security.logout();
                    this.security.clearTokens();
                    this.router.navigate(['/login']); 
                }
            });
        }
    }

    toReservations(){
        this.router.navigateByUrl(`/reservaciones/company/${this.companyId}`);
    }
}
