import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { StatsService } from 'app/services/stats.service';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ImageModule } from 'primeng/image';
import { FieldsetModule } from 'primeng/fieldset';

import { PanelModule } from 'primeng/panel';
import { Table } from "../table/table";
import { GlobalStatsComponent } from '../global-stats/global-stats';
import { Lieu } from '../lieu/lieu';
import _ from 'lodash';
import { Commander, Stats, StatsPerCommander } from 'app/models/game.model';
import { BarChart, BarChartDataInput } from "../bar-chart/bar-chart";
import { SettingsService } from 'app/settings.service';


@Component({
  selector: 'app-dashboard',
  imports: [Lieu, PanelModule, FieldsetModule, CardModule, TableModule, ImageModule, Table, GlobalStatsComponent, BarChart],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dashboard.css',
})
export class Dashboard {

  public statsService = inject(StatsService);
  public settings: SettingsService = inject(SettingsService);



  public activeCommanders = computed<_.Dictionary<Commander>>(() => {
    return _.chain(this.statsService.commanders())
      .filter((cmr, name) => this.isActive(this.settings.currentYear(), cmr))
      .map(cmr => [cmr.commander, cmr])
      .fromPairs()
      .value();
  });

  public perWinrate = computed<Stats[]>(() => {
    return _.chain(this.statPerCommanderCurYear())
      .values()
      .filter(s => !_.isNil(s))
      .filter(s => s.games > 3)
      .orderBy('winrate')
      .value();

  });

  public perGames = computed(() => {
    return _.chain(this.statPerCommanderCurYear())
      .values()
      .filter(s => !_.isNil(s))
      .orderBy('games')
      .value();
  });

  public statPerCommanderCurYear = computed(() => {
    const year = this.settings.currentYear();
    const filteredGames = _.chain(this.statsService.games())
      .filter({ 'year': year })
      .groupBy('deck')
      .value();

    console.log('statPerCommanderCurYear', filteredGames, this.statsService.games(), this.settings.currentYear(), typeof this.settings.currentYear())

    const statsPerCmr = _.chain(filteredGames)
      .mapValues(((games, deck) => this.statsService.calcStats(new StatsPerCommander(this.statsService.commanders()[deck]), games)))
      .value();

    return _.chain(this.activeCommanders())
      .mapValues((cmr, name) =>
        statsPerCmr[name] ?? new StatsPerCommander(cmr)
      )
      .value()
  })


  private isActive(year: number, cmr: Commander): boolean {
    return cmr.debut <= year && (_.isNil(cmr.fin) || cmr.fin >= year);
  }

  getBarChartData(stats: Stats[], sortProp: keyof Stats): BarChartDataInput {

    let data = _.chain(stats).sortBy(s => -s[sortProp]).slice(0, 5).value();

    return {
      labels: _.map(data, d => d.title),
      datasets: {
        winrate: _.map(data, d => _.round(d.winrate * 100, 1)),
        games: _.map(data, d => d.games)
      }
    }
  }


}
