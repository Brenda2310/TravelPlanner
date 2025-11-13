import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { SecurityStore } from '../security/services/security-store';
import { AuthStatus } from "../security/auth/logout/auth-status/auth-status";
import { CompanyStore } from '../companies/services/company-store';

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
  private readonly company = inject(CompanyStore);

  currentCompany = this.company.currentCompany;

  public isAuthenticated() {
        return this.store.auth().isAuthenticated;
  }

  public isAdmin(){
    return this.store.auth().isAdmin;
  }

  public isCompany(){
    return this.store.auth().isCompany;
  }

  public toProfile(){
    if(this.isCompany()){
      this.router.navigateByUrl(`/companies/profile/${this.currentCompany()?.id}`);
    }
    else{
      this.router.navigateByUrl('/profile/me');
    }
  }

  public toReservations(){
    if(this.isCompany()){
      this.router.navigateByUrl(`/reservaciones/company/${this.currentCompany()?.id}`);
    }
    else{
      this.router.navigateByUrl(`/reservaciones`);
    }
  }

  public onLogout(): void {
    this.store.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }
}
