import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { StatsService } from 'app/services/stats.service';
import { CardModule } from 'primeng/card';
import { Table } from '../table/table';


@Component({
  selector: 'app-lieu',
  imports: [AsyncPipe, CardModule, Table],
  templateUrl: './lieu.html',
  styleUrl: './lieu.scss',
})
export class Lieu {
  constructor(public stats: StatsService) {

  }
}
