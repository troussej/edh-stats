import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
// import { StatsService } from './services/stats.service';
import { provideHttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { StatsService } from './services/stats.service';
import { definePreset } from '@primeuix/themes';

// const MyPreset = definePreset(Aura, {
//   semantic: {
//     primary: {
//       color: 'light-dark({primary.500}, {primary.400})',
//       contrastColor: 'light-dark(#ffffff, {surface.900})'
//     }
//   }
// });

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    providePrimeNG({
      license: 'eyJpZCI6ImIyODU1ZjJmLTQ4NDUtNGM3Zi1hZWM1LWQzNmFkMGY3YTI1YiIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3ODY2MzMyMzYsImV4cCI6MTgxODE2OTIzNn0.-a4OJXAKKM9q3fC6PJ8TyCMrRDGnoivoORTbFreE1hqvA23uSZDcQn_VeC4nRB45TN0cYqUvOitnY4n_TpVSCA',
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: 'system',

          cssVariables: true
        }
      }
    }),
    provideHttpClient(),
    provideAppInitializer(() => {
      console.log('provideAppInitializer');
      // return of(true);
      const service = inject(StatsService);
      return service.initData();
    }),
  ]
};
