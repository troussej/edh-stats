import { AsyncPipe, JsonPipe, PercentPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { StatsService } from 'app/services/stats.service';
import { map, Observable } from 'rxjs';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ImageModule } from 'primeng/image';
import { FieldsetModule } from 'primeng/fieldset';

import { PanelModule } from 'primeng/panel';
import { Table } from "../table/table";
import { GlobalStats } from '../global-stats/global-stats';
import { Lieu } from '../lieu/lieu';
import _ from 'lodash';
import { Stats } from 'app/models/game.model';
import { ConfigService } from 'app/services/config.service';


@Component({
  selector: 'app-dashboard',
  imports: [AsyncPipe, Lieu, PanelModule, FieldsetModule, CardModule, TableModule, ImageModule, Table, GlobalStats],
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

    return this.statsService.stats.pipe(map(stats => _.filter(stats[this.currentYear].parCommander, s => s.games >= 3)));

  }

  get perGames(): Observable<Stats[]> {
    return this.statsService.stats.pipe(map(s => s[this.currentYear].parCommander));
  }
}
