import { Component, computed, inject } from '@angular/core';
import { Table } from "../charts/stats-table/stats-table";
import { BarChart, BarChartDataInput } from "../charts/bar-chart/bar-chart";
import { FieldsetModule } from "primeng/fieldset";
import { Stats } from 'app/models/game.model';
import { StatsService } from 'app/services/stats.service';
import { SettingsService } from 'app/services/settings.service';
import _ from 'lodash';
import { PanelModule } from "primeng/panel";

@Component({
  selector: 'app-per-bracket',
  imports: [Table, BarChart, FieldsetModule, PanelModule],
  templateUrl: './per-bracket.html',
  styleUrl: './per-bracket.css',
})
export class PerBracket {

  private sortOrder = {
    '1': 1,
    '2': 2,
    '3': 3,
    '3+': 3.1,
    '4': 4
  }


  public statsService = inject(StatsService);
  public settings: SettingsService = inject(SettingsService);

  public perBracket = computed<Stats[]>(() => {
    return _.chain(this.statsService.games())
      .filter({ year: this.settings.currentYear() })
      .filter(g => {
        const cmr = this.statsService.commanders()[g.deck];
        return this.settings.filterCommanders()(cmr);
      })
      .groupBy(g => this.statsService.commanders()[g.deck]?.bracket ?? g.deck)
      .mapValues((games, bracket) => this.statsService.calcStats(new Stats(bracket), games))
      .values()
      .filter(s => !_.isNil(s))
      .orderBy(s => this.sortOrder[s.title as keyof typeof this.sortOrder])
      .value();

  });

  getBarChartData(stats: Stats[]): BarChartDataInput {
    return {
      labels: _.map(stats, d => d.title),
      datasets: {
        winrate: _.map(stats, d => _.round(d.winrate * 100, 1)),
        games: _.map(stats, d => d.games)
      }
    }
  }
}
