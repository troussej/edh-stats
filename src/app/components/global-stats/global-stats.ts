import { AsyncPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { StatsService } from 'app/services/stats.service';
import { CardModule } from 'primeng/card';
import { Table } from '../table/table';

import { Observable } from 'rxjs/internal/Observable';
import { Stats } from 'app/models/game.model';
import { map } from 'rxjs';

@Component({
  selector: 'app-global-stats',
  imports: [AsyncPipe, CardModule, Table,],
  templateUrl: './global-stats.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './global-stats.scss',
})
export class GlobalStats {
  public statsService: StatsService = inject(StatsService);


  get globals(): Observable<Stats[]> {
    return this.statsService.stats.pipe(map(stats => [stats.globals]));
  }
}
