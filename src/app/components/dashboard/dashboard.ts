import { AsyncPipe, JsonPipe, PercentPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, OnInit, model } from '@angular/core';
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
import { Commander, Stats } from 'app/models/model';
import { ConfigService } from 'app/services/config.service';
import { BarChart, BarChartDataInput } from "../bar-chart/bar-chart";


@Component({
  selector: 'app-dashboard',
  imports: [AsyncPipe, Lieu, PanelModule, FieldsetModule, CardModule, TableModule, ImageModule, Table, GlobalStatsComponent, BarChart, AsyncPipe],
  // imports: [GlobalStats, AsyncPipe, PanelModule, CardModule, TableModule, ImageModule, Table],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dashboard.css',
})
export class Dashboard {

  public statsService = inject(StatsService);
  public config = inject(ConfigService).config;

  public currentYear = this.config.defaultYear;

  get perWinrate(): Observable<Stats[]> {

    return this.statsService.stats.pipe(map(stats => _.chain(stats[this.currentYear].parCommander)
      .filter(s => this.isActive(this.currentYear, s.commander))
      .filter(s => s.games >= 3).value()));

  }

  get perGames(): Observable<Stats[]> {
    return this.statsService.stats.pipe(map(s => _.chain(s[this.currentYear].parCommander)
      .filter(s => this.isActive(this.currentYear, s.commander))
      .value()
    ));
  }

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
