import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { SecurityStore } from '../security/services/security-store';
import { AuthStatus } from "../security/auth/logout/auth-status/auth-status";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, AuthStatus],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  private readonly store = inject(SecurityStore);
  private readonly router = inject(Router);

  public isAuthenticated() {
        return this.store.auth().isAuthenticated;
    }
}
