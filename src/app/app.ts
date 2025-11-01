import { Component, computed, effect, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Footer } from './footer/footer';
import { Header } from './header/header';
import { filter } from 'rxjs';
import { Layout } from "./AppLayout/layout/layout";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Layout],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
}
