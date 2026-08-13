import { AsyncPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { StatsService } from 'app/services/stats.service';
import { CardModule } from 'primeng/card';
import { Table } from '../table/table';


@Component({
  selector: 'app-lieu',
  imports: [AsyncPipe, CardModule, Table],
  templateUrl: './lieu.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lieu.scss',
})
export class Lieu {
  constructor(public stats: StatsService) {

  }
}
