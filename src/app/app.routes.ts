import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Commanders } from './components/commanders/commanders';
import { GamesTimeline } from './games-timeline/games-timeline';
import { Themes } from './themes/themes';
import { CommanderDetail } from './commander-detail/commander-detail';

export const routes: Routes = [
    { path: '', component: Dashboard, },
    { path: 'commanders', component: Commanders, },
    { path: 'commander/:cmr', component: CommanderDetail, },
    { path: 'timeline', component: GamesTimeline, },
    { path: 'themes', component: Themes, },

];
