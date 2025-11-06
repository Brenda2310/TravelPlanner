import { Component, inject } from '@angular/core';
import { Login } from '../security/auth/login/login';
import { AuthStatus } from '../security/auth/logout/auth-status/auth-status';
import { RouterModule } from '@angular/router';
import { Testimonials } from "./testimonials/testimonials/testimonials";
import { Features } from "./features/features";
import { UserStore } from '../users/services/user-store';
import { SecurityStore } from '../security/services/security-store';

@Component({
  selector: 'app-home',
  imports: [RouterModule, Testimonials, Features],
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home{
    private readonly store = inject(SecurityStore);

    public isAuthenticated() {
        return this.store.auth().isAuthenticated;
    }

}
