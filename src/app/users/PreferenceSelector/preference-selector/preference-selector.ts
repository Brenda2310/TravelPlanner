import { Component, inject, OnInit } from '@angular/core';
import { UserStore } from '../../services/user-store';
import { UserCreateDTO, UserPreference, UserUpdateDTO } from '../../user-models';
import { Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

export const ALL_PREFERENCES: UserPreference[] = [
  'CULTURAL', 'HISTORIC', 'RELIGION', 'NATURAL', 'BEACHES', 'SPORT', 'FOODS', 
  'ADULT', 'SHOPS', 'AMUSEMENTS', 'ARCHITECTURE', 'VIEW_POINTS', 'OTHER' 
];

@Component({
  selector: 'app-preference-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preference-selector.html',
  styleUrls: ['./preference-selector.css']
})
export class PreferenceSelector implements OnInit {
  private readonly store = inject(UserStore);

  private readonly dialogRef = inject(MatDialogRef<PreferenceSelector>);
  public readonly data = inject(MAT_DIALOG_DATA) as { userData: Partial<UserUpdateDTO>, isEditing: boolean, userId?: number };

  public readonly allPreferences = ALL_PREFERENCES;
  public selectedPreferences: UserPreference[] = [];
  public selectionError: string | null = null;
  public loading: boolean = false;

  ngOnInit() {
      if (this.data.isEditing && this.data.userData.preferencias) {
          this.selectedPreferences = [...this.data.userData.preferencias];
      }
  }

  togglePreference(pref: UserPreference): void {
      const index = this.selectedPreferences.indexOf(pref);
      if (index > -1) {
          this.selectedPreferences.splice(index, 1);
      } else {
          this.selectedPreferences.push(pref);
      }
      this.selectionError = null;
  }

  onFinalSubmit(): void {
    if (this.selectedPreferences.length === 0) {
        this.selectionError = "Debes seleccionar al menos una preferencia.";
        return;
    }

    this.loading = true;
    
    let action$: Observable<any>;

    const dataToSend = { 
        ...this.data.userData, 
        preferencias: this.selectedPreferences 
    };

    if (this.data.isEditing) {
        const updateDto: UserUpdateDTO = dataToSend as UserUpdateDTO;
        action$ = this.store.updateUser(this.data.userId!, updateDto);
    } else {
        const createDto: UserCreateDTO = dataToSend as UserCreateDTO;
        action$ = this.store.createUser(createDto);
    }

    action$.subscribe({
        next: () => {
            this.dialogRef.close({ success: true, message: this.data.isEditing ? 'Usuario actualizado.' : 'Registro exitoso.' });
        },
        error: (err) => {
            this.loading = false;
            console.error("Error al guardar:", err); 
            this.selectionError = err.error?.message || "Error al finalizar el registro/edición.";
        }
    });
}
}
