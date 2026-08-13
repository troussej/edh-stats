import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { Dashboard } from "./components/dashboard/dashboard";
import { BreadcrumbModule } from "primeng/breadcrumb";
// import { Dashboard } from './components/dashboard/dashboard';

@Component({
  selector: 'app-root',
  imports: [MenubarModule, RouterOutlet, Dashboard, BreadcrumbModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('EDH Stats');
}

