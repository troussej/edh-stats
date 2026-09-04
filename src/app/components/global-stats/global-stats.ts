import { AsyncPipe, PercentPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, computed, Signal } from '@angular/core';
import { StatsService } from 'app/services/stats.service';
import { CardModule } from 'primeng/card';

import { GlobalStats } from 'app/models/game.model';
import { PieChart } from '../charts/pie/pie-chart';
import { FieldsetModule } from "primeng/fieldset";
import { TableModule } from "primeng/table";
import { ConfigService } from 'app/services/config.service';
import _ from 'lodash';
import { ArrowDownRight, ArrowUpRight } from '@primeicons/angular';
import { RadioButton } from "primeng/radiobutton";
import { FormsModule } from '@angular/forms';
import { PanelModule } from "primeng/panel";
import { BarChart } from '../charts/bar-chart/bar-chart';
import { SettingsService } from 'app/services/settings.service';
@Component({
  selector: 'app-global-stats',
  imports: [CardModule, PieChart, FieldsetModule, TableModule, PercentPipe, ArrowUpRight, ArrowDownRight, RadioButton, FormsModule, PanelModule, BarChart],
  templateUrl: './global-stats.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './global-stats.css',
})
export class GlobalStatsComponent {
  public statsService: StatsService = inject(StatsService);
  public settings: SettingsService = inject(SettingsService);
  public config = inject(ConfigService).config;

  public globals: Signal<{ [x: string]: GlobalStats }> = computed(() => {
    const data = _.chain(this.statsService.games())
      // .filter(g => {
      //   const cmr = this.statsService.commanders()[g.deck];
      //   return this.settings.filterCommanders()(cmr);
      // })
      .groupBy('year')
      .mapValues((gamesForYear, year) => this.statsService.calcStats(new GlobalStats(year), gamesForYear))
      .value();

    this.calcMovementFromPrevYear(data);

    return data;
  })

  public globalsAsArray = computed(() => {
    return _.values(this.globals());
  });

  public chartData = computed(() => {
    return this.globals()[this.settings.currentYear()];
  });

  calcMovementFromPrevYear(data: { [x: string]: GlobalStats }) {

    _.forEach(this.config.years, year => {
      if (data[year - 1]) {

        const current = data[year];
        const prev = data[year - 1];

        current.gamesMovement = current.games > prev.games;
        current.winMovement = current.wins > prev.wins;
        current.lossMovement = current.losses > prev.losses;
        current.winrateMovement = current.winrate > prev.winrate;
      }
    })

    return data;
  }
}
