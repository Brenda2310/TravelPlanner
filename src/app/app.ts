import { Component } from '@angular/core';
import { Layout } from './AppLayout/layout/layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Layout],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {}
