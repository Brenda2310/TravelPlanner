import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityStore } from '../../security/services/security-store';

@Component({
  selector: 'app-features',
  imports: [],
  templateUrl: './features.html',
  styleUrl: './features.css',
})
export class Features {
  private readonly store = inject(SecurityStore);
  protected readonly router = inject(Router);

  public isAuthenticated() {
    return this.store.auth().isAuthenticated;
  }
}
