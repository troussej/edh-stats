import { AsyncPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, Input } from '@angular/core';
import { StatsService } from 'app/services/stats.service';
import { CardModule } from 'primeng/card';
import { Table } from '../table/table';
import { map, Observable } from 'rxjs';
import { Stats } from 'app/models/game.model';


@Component({
  selector: 'app-lieu',
  imports: [AsyncPipe, CardModule, Table],
  templateUrl: './lieu.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lieu.css',
})
export class Lieu {
  public statsService: StatsService = inject(StatsService);


  @Input({ required: true })
  public currentYear!: number;

  get parlieu(): Observable<Stats[]> {
    return this.statsService.stats.pipe(map(stats => stats[this.currentYear].parLieu));
  }
}