import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Commanders } from './components/commanders/commanders';

export const routes: Routes = [
    { path: '', component: Dashboard, },
    { path: 'commanders', component: Commanders, },
];
