import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { StatsService } from 'app/services/stats.service';
import { CardModule } from 'primeng/card';
import { Table } from '../table/table';

@Component({
  selector: 'app-global-stats',
  imports: [AsyncPipe, CardModule, Table,],
  templateUrl: './global-stats.html',
  styleUrl: './global-stats.scss',
})
export class GlobalStats {
  constructor(public stats: StatsService) {

  }

  get globals() {
    return [this.stats.globals];
  }
}
