import { AsyncPipe, JsonPipe, PercentPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, Input } from '@angular/core';
import { StatsService } from 'app/services/stats.service';
import { CardModule } from 'primeng/card';
import { Table } from '../table/table';

import { Observable } from 'rxjs/internal/Observable';
import { Stats } from 'app/models/game.model';
import { map } from 'rxjs';
import { Pie } from '../pie/pie';
import { FieldsetModule } from "primeng/fieldset";
import { TableModule } from "primeng/table";
import { ConfigService } from 'app/services/config.service';
import _ from 'lodash';
@Component({
  selector: 'app-global-stats',
  imports: [AsyncPipe, CardModule, Pie, FieldsetModule, TableModule, PercentPipe, JsonPipe],
  templateUrl: './global-stats.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './global-stats.css',
})
export class GlobalStats {
  public statsService: StatsService = inject(StatsService);
  public config = inject(ConfigService).config;

  @Input({ required: true })
  public currentYear!: number;


  get globalsCurrentYear(): Observable<Stats> {
    return this.globals.pipe(map(globals => globals[this.currentYear as number]));
  }

  get globals(): Observable<{ [year: number]: Stats }> {
    return this.statsService.stats.pipe(
      map(stats =>
        _.chain(this.config.years).map(year => [year, stats[year].globals]).fromPairs().value()
      ));
  }

  get globalsAsArray(): Observable<Stats[]> {
    return this.globals.pipe(map(globals => _.values(globals)));
  }
}
