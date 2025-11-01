import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserStore } from '../services/user-store';
import { SecurityStore } from '../../security/services/security-store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit{
private readonly router = inject(Router);
    public readonly userStore = inject(UserStore);
    public readonly securityStore = inject(SecurityStore);

    public currentUser = this.userStore.profile; 

    ngOnInit(): void {
        this.userStore.loadProfile();
    }

    onEditProfile(): void {
        this.router.navigate(['/profile/me/edit']); 
    }

    onDeleteAccount(): void {
        if (confirm('¿Estás seguro de eliminar tu cuenta? Esta acción es irreversible (borrado lógico).')) {
            this.userStore.deleteOwnAccount().subscribe({
                next: () => {
                    this.securityStore.logout();
                    this.router.navigate(['/login']);
                },
                error: (err) => {
                    console.error('Error al eliminar cuenta:', err);
                    alert('Error al eliminar la cuenta');
                }
            });
        }
    }
}
