import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStore } from '../../services/user-store';
import { PasswordValidators } from '../../validators/PasswordValidators';
import { UserCreateDTO, UserPreference, UserResponseDTO, UserUpdateDTO} from '../../user-models';
import { filter, Observable, take } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

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
export class UserRegister implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly store = inject(UserStore);
  private readonly route = inject(ActivatedRoute);

  private profile$ = toObservable(this.store.profile);
  private userDetails$ = toObservable(this.store.userToEdit);

  public errorMessage: string | null = null;
  public loading: boolean = false;
  public readonly allPreferences = ALL_PREFERENCES;

  @Input() userId?: number;
  public isEditing: boolean = false; 
  public isOwnProfile: boolean = false;

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

  ngOnInit(): void {
    const idFromUrl = this.route.snapshot.paramMap.get('id');
    const currentPath = this.router.url;
    let dataObservable: Observable<UserResponseDTO | null> | null = null;

    if (currentPath.includes('/profile/me')) {
            this.isEditing = true;
            this.isOwnProfile = true;
            this.store.loadProfile();
            dataObservable = this.profile$;
        }
    else if (idFromUrl) {
            this.userId = +idFromUrl;
            this.isEditing = true;
            this.store.loadUserById(this.userId);
            dataObservable = this.userDetails$
        }
    if (this.isEditing) {
          this.removePasswordValidators();
      }
    if (dataObservable) {
            this.handleDataPatching(dataObservable);
        }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage = 'Por favor, corrija los errores del formulario.';
      return;
    }

    let action$: Observable<any>;
    
    this.loading = true;
    this.errorMessage = null;

    const formValue = this.registerForm.value;
    const passwordValue = formValue.password;

    const userDto: UserUpdateDTO = {
        username: formValue.username!,
        email: formValue.email!,
        dni: formValue.dni!,
        preferences: formValue.preferences! 
    };

    if (!this.isEditing || (this.isEditing && passwordValue)) {
        userDto.password = passwordValue!;
    }

    if (this.isOwnProfile) {
            action$ = this.store.updateOwnAccount(userDto);
        } 
        else if (this.userId) {
            action$ = this.store.updateUser(this.userId, userDto);
        } 
        else {
            action$ = this.store.createUser(userDto as UserCreateDTO);
        }

     action$.subscribe({
        next: () => {
            const successMessage = this.isEditing ? 'Usuario actualizado exitosamente.' : 'Registro exitoso. Por favor, inicie sesión.';
            alert(successMessage);
            
            const targetRoute = this.isEditing ? '/users' : '/login'; 
            this.router.navigate([targetRoute]);
        },
        error: (err) => {
            this.errorMessage = err.error?.message || 'Ocurrió un error inesperado. Inténtelo de nuevo.';
            this.loading = false;
        }
    });
  }

  private handleDataPatching(dataObservable: Observable<UserResponseDTO | null>): void {
        dataObservable.pipe(
            filter((user): user is UserResponseDTO => !!user),
            take(1) 
        ).subscribe(user => {
            this.registerForm.patchValue({
                username: user.username,
                dni: user.dni,
                preferences: user.preferencias
            });
        });
    }

    private removePasswordValidators(): void {
        this.registerForm.get('password')?.setValidators([PasswordValidators.strongPassword]);
        this.registerForm.get('confirmPassword')?.setValidators(null);
    
        this.registerForm.removeValidators(PasswordValidators.match('password', 'confirmPassword'));

        this.registerForm.get('password')?.updateValueAndValidity();
        this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    }

}
