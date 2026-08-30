import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Commanders } from './pages/commanders/commanders';
import { GamesTimeline } from './pages/games-timeline/games-timeline';
import { Themes } from './themes/themes';
import { CommanderDetail } from './pages/commander-detail/commander-detail';

export const routes: Routes = [
    { path: '', component: Dashboard, },
    { path: 'commanders', component: Commanders, },
    { path: 'commander/:cmr', component: CommanderDetail, },
    { path: 'timeline', component: GamesTimeline, },
    { path: 'themes', component: Themes, },

];
