import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { SecurityStore } from '../security/services/security-store';
import { AuthStatus } from "../security/auth/logout/auth-status/auth-status";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AuthStatus],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  private readonly store = inject(SecurityStore);
  private readonly router = inject(Router);

  public isAuthenticated() {
        return this.store.auth().isAuthenticated;
    }

  public toProfile(){
    this.router.navigateByUrl('/profile/me');
  }

  public onLogout(): void {
    this.store.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }
}
