import { Component, computed, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Footer } from '../../footer/footer';
import { Header } from '../../header/header';
import { filter } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, Footer, Header],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  protected readonly title = signal('TravelPlanner');
  private readonly currentUrl = signal<string>('/');

  readonly isLoginPage = computed(() => {
  const url = this.currentUrl().split('?')[0];
  return url === '/login' || url.startsWith('/auth/login');
});

readonly isRegisterPage = computed(() => {
  const url = this.currentUrl().split('?')[0];
  return url === '/register' || url.startsWith('/auth/register');
});



  constructor(private router: Router) {
    this.currentUrl.set(this.router.url);

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.currentUrl.set(e.urlAfterRedirects));
  }
}
