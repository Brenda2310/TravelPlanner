import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SecurityStore } from '../../services/security-store';
import { Router } from '@angular/router';
import { AuthRequest } from '../../security-models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit{
  public readonly store = inject(SecurityStore);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  ngOnInit(): void {
    if (this.store.auth().isAuthenticated) {
      this.router.navigate(['/']);
    }
  }

  onSubmit() {
  if (this.loginForm.invalid) return;

  const authRequest: AuthRequest = {
    username: this.loginForm.get('email')?.value ?? '',
    password: this.loginForm.get('password')?.value ?? ''
  };

  console.log('Payload enviado:', authRequest); // debug

  this.store.authenticateUser(authRequest).subscribe({
    next: () => {
      this.router.navigate(['/']);
    },
    error: (err) => {
      console.error('Login error', err);
    },
  });
}
 }

