import { Component, computed, inject, Signal } from '@angular/core';
import { Game, GlobalStats, Stats } from 'app/models/game.model';
import { ConfigService } from 'app/services/config.service';
import { StatsService } from 'app/services/stats.service';
import { SettingsService } from 'app/settings.service';
import _ from 'lodash';
import { CardModule } from "primeng/card";
import { Table } from "app/components/charts/stats-table/stats-table";
import { TableModule } from 'primeng/table';
import { Debug } from 'app/debug/debug';
import { Options } from 'app/components/options/options';

@Component({
  selector: 'app-themes',
  imports: [CardModule, Table, Debug, Options],
  templateUrl: './themes.html',
  styleUrl: './themes.css',
})
export class Themes {
  public statsService: StatsService = inject(StatsService);
  public settings: SettingsService = inject(SettingsService);
  public config = inject(ConfigService).config;

  public stats: Signal<Stats[]> = computed(() => {

    const commanders = this.statsService.commanders();

    const themes: string[] = _.chain(this.statsService.games())
      .filter(g => g.year === this.settings.currentYear())
      .flatMap(game => commanders[game.deck]?.themes)
      .filter(t => !_.isNil(t))
      .filter(t => t !== '')
      .uniq()
      .sort()
      .value();

    const gamesByTheme: { [x: string]: Game[] } = _.chain(themes)
      .map(t => ([t, [] as Game[]]))
      .fromPairs()
      .value();

    _.chain(this.statsService.games())
      .filter(g => g.year === this.settings.currentYear())
      .reduce((cumul, game) => {
        const themes = commanders[game?.deck ?? '']?.themes ?? [];
        _.forEach(themes, t => {
          gamesByTheme[t]?.push(game);
        })
        return cumul;
      }, gamesByTheme)
      .value();



    return _.chain(gamesByTheme)
      .mapValues((games, theme) => this.statsService.calcStats(new Stats(theme), games))
      .values()
      .value();
  })

}
