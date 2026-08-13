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

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    providePrimeNG({
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
