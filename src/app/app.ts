import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { Dashboard } from "./components/dashboard/dashboard";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { Shield, Home, Calculator } from '@primeicons/angular';
import { MenuItem } from 'primeng/api';
// import { Dashboard } from './components/dashboard/dashboard';

@Component({
  selector: 'app-root',
  imports: [MenubarModule, RouterOutlet, Dashboard, BreadcrumbModule, Shield, Home, Calculator],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  protected readonly title = signal('EDH Stats');
  private router = inject(Router);
  public menuData: MenuItem[] = [];
  ngOnInit(): void {
    this.menuData = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => {
          this.router.navigate(['']);
        }

      },
      {
        label: 'Commanders',
        icon: 'pi pi-shield',
        command: () => {
          this.router.navigate(['/commanders']);
        }

      },
      {
        label: 'Timeline',
        icon: 'pi pi-calendar',
        command: () => {
          this.router.navigate(['/timeline']);
        }

      },
    ];
  }


}

