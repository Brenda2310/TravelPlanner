import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserStore } from '../../services/user-store';
import { PasswordValidators } from '../../validators/PasswordValidators';
import { UserCreateDTO, UserPreference} from '../../user-models';

export const ALL_PREFERENCES: UserPreference[] = [
  'CULTURAL', 'HISTORIC', 'RELIGION', 'NATURAL', 'BEACHES', 'SPORT', 'FOODS', 
  'ADULT', 'SHOPS', 'AMUSEMENTS', 'ARCHITECTURE', 'VIEW_POINTS', 'OTHER' 
];

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-register.html',
  styleUrls: ['./user-register.css']
})
export class UserRegister {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly store = inject(UserStore);

  public errorMessage: string | null = null;
  public loading: boolean = false;
  public readonly allPreferences = ALL_PREFERENCES;

  public registerForm = this.fb.group({
    username:['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
    email:['', [Validators.required, Validators.email]],
    dni:['', [Validators.required, Validators.pattern(/^[0-9]{7,8}$/)]],
    password:['', [Validators.required, PasswordValidators.strongPassword]],
    confirmPassword:['', [Validators.required]],
    preferences:[[] as any, [Validators.required]]
  },
  {
    validators: PasswordValidators.match('password', 'confirmPassword')
  });

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage = 'Por favor, corrija los errores del formulario.';
      return;
    }
    
    this.loading = true;
    this.errorMessage = null;

    const formValue = this.registerForm.value;
    const userDto: UserCreateDTO = {
        username: formValue.username!,
        email: formValue.email!,
        password: formValue.password!,
        dni: formValue.dni!,
        preferences: formValue.preferences! 
    };

    this.store.createUser(userDto).subscribe({
        next: () => {
            alert('Registro exitoso. Por favor, inicie sesión.');
            this.router.navigate(['/login']);
        },
        error: (err) => {
            this.errorMessage = err.error?.message || 'Error al registrar usuario.';
            this.loading = false;
        }
    });
  }

}
