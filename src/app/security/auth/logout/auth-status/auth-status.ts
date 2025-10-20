import { Component, inject } from '@angular/core';
import { SecurityStore } from '../../../services/security-store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-status',
  imports: [],
  standalone: true,
  templateUrl: './auth-status.html',
  styleUrls: ['./auth-status.css']
})
export class AuthStatus {
  public readonly store = inject(SecurityStore);
  private readonly router = inject(Router);

  get userRoles(): string {
    return this.store.auth().userRoles.join(', ');
  }

  onLogout(): void {
    this.store.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']); 
      },
      error: (err) => {
        this.router.navigate(['/login']);
      }
    });
  }

  onLogin():void{
    this.router.navigateByUrl('/login');
  }
}
