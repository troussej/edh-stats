import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { StatsService } from 'app/services/stats.service';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ImageModule } from 'primeng/image';
import { FieldsetModule } from 'primeng/fieldset';

import { PanelModule } from 'primeng/panel';
import { Table } from "../../components/charts/stats-table/stats-table";
import { GlobalStatsComponent } from '../../components/global-stats/global-stats';
import { Lieu } from '../../components/lieu/lieu';
import _ from 'lodash';
import { Stats, StatsPerCommander } from 'app/models/game.model';
import { BarChart, BarChartDataInput } from "../../components/charts/bar-chart/bar-chart";

import { PerBracket } from '../../components/per-bracket/per-bracket';
import { Options } from "app/components/options/options";
import { SettingsService } from 'app/services/settings.service';


@Component({
  selector: 'app-dashboard',
  imports: [Lieu, PanelModule, FieldsetModule, CardModule, TableModule, ImageModule, Table, GlobalStatsComponent, BarChart, PerBracket, Options, Options],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dashboard.css',
})
export class Dashboard {

  public statsService = inject(StatsService);
  public settings: SettingsService = inject(SettingsService);

  public perWinrate = computed<Stats[]>(() => {
    return _.chain(this.statPerCommanderCurYear())
      .filter(s => !_.isNil(s))
      .filter(s => s.games > 3)
      .orderBy('winrate')
      .value();

  });

  public perGames = computed(() => {
    return _.chain(this.statPerCommanderCurYear())
      .filter(s => !_.isNil(s))
      .orderBy('games')
      .value();
  });

  public statPerCommanderCurYear = computed(() => {

    const filteredGames = _.chain(this.statsService.games())
      .filter(this.settings.filterGames())
      .groupBy('deck')
      .value();

    console.log('statPerCommanderCurYear', filteredGames, this.statsService.games(), this.settings.currentYear(), typeof this.settings.currentYear())

    const statsPerCmr = _.chain(filteredGames)
      .mapValues(((games, deck) => this.statsService.calcStats(new StatsPerCommander(this.statsService.commanders()[deck]), games)))
      .value();

    return _.chain(this.statsService.activeCommanders())
      .filter(cmr => {
        return this.settings.filterCommanders()(cmr);
      })
      .map((cmr) =>
        statsPerCmr[cmr.commander] ?? new StatsPerCommander(cmr)
      )
      .value()
  })

  getBarChartData(stats: Stats[], max: number | undefined, sortProp: keyof Stats): BarChartDataInput {

    max = max ?? stats.length;

    let data = _.chain(stats).sortBy(s => -s[sortProp]).slice(0, max).value();

    return {
      labels: _.map(data, d => d.title),
      datasets: {
        winrate: _.map(data, d => _.round(d.winrate * 100, 1)),
        games: _.map(data, d => d.games)
      }
    }
  }


}
