import { AsyncPipe, JsonPipe, PercentPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, OnInit, model, computed, signal } from '@angular/core';
import { StatsService } from 'app/services/stats.service';
import { map, Observable } from 'rxjs';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ImageModule } from 'primeng/image';
import { FieldsetModule } from 'primeng/fieldset';

import { PanelModule } from 'primeng/panel';
import { Table } from "../table/table";
import { GlobalStatsComponent } from '../global-stats/global-stats';
import { Lieu } from '../lieu/lieu';
import _ from 'lodash';
import { Commander, GlobalStats, Stats, StatsPerCommander } from 'app/models/game.model';
import { ConfigService } from 'app/services/config.service';
import { BarChart, BarChartDataInput } from "../bar-chart/bar-chart";
import { Debug } from "app/debug/debug";
import { SettingsService } from 'app/settings.service';


@Component({
  selector: 'app-dashboard',
  imports: [AsyncPipe, Lieu, PanelModule, FieldsetModule, CardModule, TableModule, ImageModule, Table, GlobalStatsComponent, BarChart, AsyncPipe, Debug],
  // imports: [GlobalStats, AsyncPipe, PanelModule, CardModule, TableModule, ImageModule, Table],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dashboard.css',
})
export class Dashboard {

  public statsService = inject(StatsService);
  public config = inject(ConfigService).config;
  public settings: SettingsService = inject(SettingsService);



  public activeCommanders = computed<_.Dictionary<Commander>>(() => {
    return _.chain(this.statsService.commandersS())
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
      .mapValues(((games, deck) => this.statsService.calcStats(new StatsPerCommander(this.statsService.commandersS()[deck]), games)))
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
