import { Component, computed, effect, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Footer } from './footer/footer';
import { Header } from './header/header';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('TravelPlanner');
  private readonly currentUrl = signal<string>('/');

  readonly isLoginPage = computed(() => {
    const url = this.currentUrl().split('?')[0];
    return url === '/login' || url.startsWith('/auth/login');
  });

  constructor(private router: Router) {
    this.currentUrl.set(this.router.url);

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.currentUrl.set(e.urlAfterRedirects));
  }
}
