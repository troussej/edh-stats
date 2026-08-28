import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Commanders } from './components/commanders/commanders';
import { GamesTimeline } from './games-timeline/games-timeline';
import { Themes } from './themes/themes';

export const routes: Routes = [
    { path: '', component: Dashboard, },
    { path: 'commanders', component: Commanders, },
    { path: 'timeline', component: GamesTimeline, },
    { path: 'themes', component: Themes, },

];
