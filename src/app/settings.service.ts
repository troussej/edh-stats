import { inject, model, Service, signal } from '@angular/core';
import { ConfigService } from './services/config.service';

@Service()
export class SettingsService {
    public config = inject(ConfigService).config;
    public currentYear = signal<number>(this.config.defaultYear);
}
