import { AsyncPipe, JsonPipe, PercentPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, Input, model, computed, Signal } from '@angular/core';
import { StatsService } from 'app/services/stats.service';
import { CardModule } from 'primeng/card';
import { Table } from '../table/table';

import { Observable } from 'rxjs/internal/Observable';
import { GlobalStats, Stats, StatsPerYear } from 'app/models/game.model';
import { map } from 'rxjs';
import { PieChart } from '../pie/pie-chart';
import { FieldsetModule } from "primeng/fieldset";
import { TableModule } from "primeng/table";
import { ConfigService } from 'app/services/config.service';
import _ from 'lodash';
import { ArrowDownRight, ArrowUpRight } from '@primeicons/angular';
import { RadioButton } from "primeng/radiobutton";
import { FormsModule } from '@angular/forms';
import { Debug } from 'app/debug/debug';
@Component({
  selector: 'app-global-stats',
  imports: [AsyncPipe, CardModule, PieChart, FieldsetModule, TableModule, PercentPipe, ArrowUpRight, ArrowDownRight, RadioButton, FormsModule, Debug],
  templateUrl: './global-stats.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './global-stats.css',
})
export class GlobalStatsComponent {
  public statsService: StatsService = inject(StatsService);
  public config = inject(ConfigService).config;

  public currentYear = model<number>(this.config.defaultYear);


  // get globalsCurrentYear(): Observable<GlobalStats> {
  //   return this.globals.pipe(map(globals => globals[this.currentYear()]));
  // }

  get globals_old(): Observable<{ [year: number]: GlobalStats }> {
    return this.statsService.stats.pipe(
      map(stats =>
        _.chain(this.config.years).map(year => [year, stats[year].globals]).fromPairs().value()
      ));
  }

  public globals: Signal<{ [x: string]: GlobalStats }> = computed(() => {
    const data = _.chain(this.statsService.games())
      .groupBy('year')
      .mapValues((gamesForYear, year) => this.statsService.calcStats(new GlobalStats(year), gamesForYear))
      .each((gamesForYear, year) => {

      })
      .value();

    this.calcMovementFromPrevYear(data);

    return data;
  })

  public globalsAsArray = computed(() => {
    return _.values(this.globals());
  });

  public chartData = computed(() => {
    return this.globals()[this.currentYear()];
  });

  calcMovementFromPrevYear(data: { [x: string]: GlobalStats }) {

    _.forEach(this.config.years, year => {
      if (data[year - 1]) {

        const current = data[year];
        const prev = data[year - 1];

        current.gamesMovement = current.games > prev.games;
        current.winMovement = current.wins > prev.wins;
        current.lossMovement = current.losses > prev.losses;
        current.winrateMovement = current.winrate > prev.winrate;
      }
    })

    return data;
  }
}
