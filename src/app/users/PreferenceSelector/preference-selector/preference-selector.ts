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

  /*onFinalSubmit(): void {
      if (this.selectedPreferences.length === 0) {
          this.selectionError = "Debes seleccionar al menos una preferencia.";
          return;
      }

      this.loading = true;
      
      const finalDto: UserUpdateDTO = { 
          ...this.data.userData, 
          preferences: this.selectedPreferences 
      } as UserUpdateDTO; 

      let action$: Observable<any>;
      
      if (this.data.isEditing) {
          action$ = this.store.updateUser(this.data.userId!, finalDto);
      } else {
          action$ = this.store.createUser(finalDto as UserCreateDTO);
      }

      action$.subscribe({
          next: () => {
              this.dialogRef.close({ success: true, message: this.data.isEditing ? 'Usuario actualizado.' : 'Registro exitoso.' });
          },
          error: (err) => {
              this.loading = false;
              this.selectionError = err.error?.message || "Error al finalizar el registro/edición.";
          }
      });
  }*/

    confirmSelection(): void {
        if(this.selectedPreferences.length === 0){
            this.selectionError = 'Debes seleccional al menos una preferencia.';
            return;
        }
        this.dialogRef.close(this.selectedPreferences);
    }
    
    cancel(): void{
        this.dialogRef.close(null);
    }

}
