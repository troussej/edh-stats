import { computed, inject, model, Service, signal } from '@angular/core';
import _ from 'lodash';
import { Commander, Game } from '../models/game.model';
import { StatsService } from './stats.service';
import { ConfigService } from './config.service';

@Service()
export class SettingsService {
    public config = inject(ConfigService).config;
    public currentYear = signal<number>(this.config.defaultYear);
    public commanderName = signal<string>('');
    public lieu = signal<string[]>([]);


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

    public filterGames = computed<(game: Game) => boolean>(() => ((game: Game) => {
        const curYear = this.currentYear();
        const lieuFilter = this.lieu();
        let res = true;
        if (curYear) {
            res = res && game.year === curYear;
        }
        if (lieuFilter && lieuFilter.length > 0) {
            res = res && lieuFilter.includes(game.lieu);
        }
        return res;
    }));

    public filterCommanders = computed<(cmr: Commander) => boolean>(() => ((cmr: Commander) => {

        return this.filterActiveCommander()(cmr)
            && this.filterCommandersByName()(cmr)
            && this.filterCommandersByBracket()(cmr);
    }));

    public filterActiveCommander = computed<(cmr: Commander) => boolean>(() => ((cmr: Commander) => {

        return cmr.isActive(this.currentYear());
    }));

    public filterCommandersByName = computed<(cmr: Commander) => boolean>(() => ((cmr: Commander) => {

        let res = true;
        const cmrFilter = this.commanderName();
        if (!_.isNil(cmrFilter) && _.trim(cmrFilter) !== '') {
            res = res && cmr.commander.toLowerCase().indexOf(cmrFilter.toLowerCase()) >= 0;
        }

        return res;
    }));


    public filterCommandersByBracket = computed<(cmr: Commander) => boolean>(() => ((cmr: Commander) => {

        let res = true

        const bracketFilter = this.bracketFilter();
        if (bracketFilter) {
            res = res && bracketFilter.includes(cmr.bracket);
        }

        return res;
    }));


    public reset() {
        this.currentYear.set(this.config.defaultYear);
        this.commanderName.set('');
        this.lieu.set([]);
        this.bracketFilter.set(['2', '3', '3+', '4',])
    }
}
