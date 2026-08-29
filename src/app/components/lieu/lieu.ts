import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { StatsService } from 'app/services/stats.service';
import { CardModule } from 'primeng/card';
import { Table } from '../charts/stats-table/stats-table';
import { Stats } from 'app/models/game.model';
import { SettingsService } from 'app/settings.service';
import _ from 'lodash';


@Component({
  selector: 'app-lieu',
  imports: [CardModule, Table],
  templateUrl: './lieu.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lieu.css',
})
export class Lieu {
  public statsService: StatsService = inject(StatsService);
  public settings: SettingsService = inject(SettingsService);



  public parlieu = computed<Stats[]>(() => {
    return _.chain(this.statsService.games())
      .filter({ year: this.settings.currentYear() })
      .groupBy('lieu')
      .mapValues((games, lieu) => this.statsService.calcStats(new Stats(lieu), games))
      .values()
      .value();

  });
}