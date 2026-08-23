import { AsyncPipe, JsonPipe, PercentPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, Input, model } from '@angular/core';
import { StatsService } from 'app/services/stats.service';
import { CardModule } from 'primeng/card';
import { Table } from '../table/table';

import { Observable } from 'rxjs/internal/Observable';
import { GlobalStats, Stats } from 'app/models/model';
import { map } from 'rxjs';
import { PieChart } from '../pie/pie-chart';
import { FieldsetModule } from "primeng/fieldset";
import { TableModule } from "primeng/table";
import { ConfigService } from 'app/services/config.service';
import _ from 'lodash';
import { ArrowDownRight, ArrowUpRight } from '@primeicons/angular';
import { RadioButton } from "primeng/radiobutton";
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-global-stats',
  imports: [AsyncPipe, CardModule, PieChart, FieldsetModule, TableModule, PercentPipe, ArrowUpRight, ArrowDownRight, RadioButton, FormsModule],
  templateUrl: './global-stats.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './global-stats.css',
})
export class GlobalStatsComponent {
  public statsService: StatsService = inject(StatsService);
  public config = inject(ConfigService).config;

  public currentYear = model<number>(this.config.defaultYear);


  get globalsCurrentYear(): Observable<GlobalStats> {
    return this.globals.pipe(map(globals => globals[this.currentYear()]));
  }

  get globals(): Observable<{ [year: number]: GlobalStats }> {
    return this.statsService.stats.pipe(
      map(stats =>
        _.chain(this.config.years).map(year => [year, stats[year].globals]).fromPairs().value()
      ));
  }

  get globalsAsArray(): Observable<GlobalStats[]> {
    return this.globals.pipe(map(globals => _.values(globals)));
  }



  setCurrentYear(year: number) {
    this.currentYear.set(year);
  }
}
