import { Component, inject } from '@angular/core';
import { SecurityStore } from '../../security/services/security-store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-features',
  imports: [],
  templateUrl: './features.html',
  styleUrl: './features.css'
})
export class Features {
    private readonly store = inject(SecurityStore);
    protected readonly router = inject(Router);

    public isAuthenticated() {
        return this.store.auth().isAuthenticated;
    }

}
