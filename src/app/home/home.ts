import { Component } from '@angular/core';
import { Login } from '../security/auth/login/login';
import { AuthStatus } from '../security/auth/logout/auth-status/auth-status';
import { RouterModule } from '@angular/router';
import { Testimonials } from "./testimonials/testimonials/testimonials";
import { Features } from "./features/features";

@Component({
  selector: 'app-home',
  imports: [RouterModule, Testimonials, Features],
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home{

}
