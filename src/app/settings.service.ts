import { computed, inject, model, Service, signal } from '@angular/core';
import { ConfigService } from './services/config.service';
import _ from 'lodash';
import { Commander, Game } from './models/game.model';
import { StatsService } from './services/stats.service';

@Service()
export class SettingsService {
    public config = inject(ConfigService).config;
    public currentYear = signal<number>(this.config.defaultYear);
    public commanderName = signal<string>('');

    public brackets = [
        {
            name: 'B2',
            value: '2'
        },
        {
            name: 'B3',
            value: '3'
        },
        {
            name: 'B3+',
            value: '3+'
        },
        {
            name: 'B4',
            value: '4'
        },

    ]
    public bracketFilter = signal<string[]>(['2', '3', '3+', '4',]);

    public filterCommanders = computed<(cmr: Commander) => boolean>(() => ((cmr: Commander) => {

        let res = cmr.isActive(this.currentYear());
        const cmrFilter = this.commanderName();
        if (!_.isNil(cmrFilter) && _.trim(cmrFilter) !== '') {
            res = res && cmr.commander.toLowerCase().indexOf(cmrFilter.toLowerCase()) >= 0;
        }
        const bracketFilter = this.bracketFilter();
        if (bracketFilter) {
            res = res && bracketFilter.includes(cmr.bracket);
        }

        return res;
    }));

    public reset() {
        this.currentYear.set(this.config.defaultYear);
        this.commanderName.set('');
        this.bracketFilter.set(['2', '3', '3+', '4',])
    }
}
