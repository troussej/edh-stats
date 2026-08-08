import { AsyncPipe, JsonPipe, PercentPipe } from '@angular/common';
import { Component } from '@angular/core';
import { StatsService } from 'app/services/stats.service';
import { Observable } from 'rxjs';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ImageModule } from 'primeng/image';

import { PanelModule } from 'primeng/panel';
import { Table } from "../table/table";
import _ from 'lodash';
import { Stats } from 'app/models/game.model';


@Component({
  selector: 'app-dashboard',
  imports: [JsonPipe, AsyncPipe, PercentPipe, PanelModule, CardModule, TableModule, ImageModule, Table],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  public data: Observable<any> | undefined;
  constructor(public stats: StatsService) {

  }
  ngOnInit(): void {
  }

  get ready(): Observable<boolean> {
    return this.stats.isReady;
  }

  get perWinrate(): Stats[] {
    return _.filter(this.stats.stats, s => s.games >= 3);
  }
}
