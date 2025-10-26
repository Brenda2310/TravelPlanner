import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserStore } from '../../services/user-store';
import { PasswordValidators } from '../../validators/PasswordValidators';
import { UserCreateDTO, UserPreference, UserResponseDTO, UserUpdateDTO} from '../../user-models';
import { filter, Observable, take } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { PreferenceSelector } from '../../PreferenceSelector/preference-selector/preference-selector';

export const ALL_PREFERENCES: UserPreference[] = [
  'CULTURAL', 'HISTORIC', 'RELIGION', 'NATURAL', 'BEACHES', 'SPORT', 'FOODS', 
  'ADULT', 'SHOPS', 'AMUSEMENTS', 'ARCHITECTURE', 'VIEW_POINTS', 'OTHER' 
];

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, RouterLink],
  templateUrl: './user-register.html',
  styleUrls: ['./user-register.css']
})
export class UserRegister implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly store = inject(UserStore);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);

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
    preferences:[[] as any]
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

    this.loading = true;
    this.errorMessage = null;

    const formValue = this.registerForm.value;
    const passwordValue = formValue.password;

    const userDto: UserUpdateDTO = {
        username: formValue.username!,
        email: formValue.email!,
        dni: formValue.dni!, 
    };

    if (!this.isEditing || (this.isEditing && passwordValue)) {
        userDto.password = passwordValue!;
    }

    const dialogRef = this.dialog.open(PreferenceSelector, {
        data: { 
            userData: userDto, 
            isEditing: this.isEditing, 
            userId: this.userId
        }
    });

    dialogRef.afterClosed().subscribe(result => {
      setTimeout(() => {
          this.loading = false; 
          this.cdr.detectChanges(); 
        });

        if (result && result.success) {
            alert(result.message);
            const targetRoute = this.isEditing ? '/users' : '/login'; 
            this.router.navigate([targetRoute]);
        }
        this.loading = false; 
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
