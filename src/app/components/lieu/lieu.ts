import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { StatsService } from 'app/services/stats.service';
import { CardModule } from 'primeng/card';
import { Table } from '../charts/stats-table/stats-table';
import { Stats } from 'app/models/game.model';
import { SettingsService } from 'app/services/settings.service';
import _ from 'lodash';
import { PanelModule } from "primeng/panel";
import { BarChart } from '../charts/bar-chart/bar-chart';
import { BracketBar } from '../bracket-bar/bracket-bar';


@Component({
  selector: 'app-lieu',
  imports: [CardModule, Table, PanelModule, BarChart, BracketBar],
  templateUrl: './lieu.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lieu.css',
})
export class Lieu {
  public statsService: StatsService = inject(StatsService);
  public settings: SettingsService = inject(SettingsService);



  private readonly filteredGames = computed(() => {
    return _.chain(this.statsService.games())
      .filter({ year: this.settings.currentYear() })
      .filter(g => {
        const cmr = this.statsService.commanders()[g.deck];
        return this.settings.filterCommanders()(cmr);
      })
      .value();
  });

  public parlieu = computed<Stats[]>(() => {
    return _.chain(this.filteredGames())
      .groupBy('lieu')
      .mapValues((games, lieu) => this.statsService.calcStats(new Stats(lieu), games))
      .values()
      .value();

  });

  readonly bracketData = computed(() => {
    const counts = new Map<string, Map<string, number>>();
    const brackets = new Set<string>();
    const commanders = this.statsService.commanders();

    for (const game of this.filteredGames()) {
      const bracket = commanders[game.deck].bracket;
      brackets.add(bracket);
      let venueCounts = counts.get(game.lieu);
      if (!venueCounts) {
        venueCounts = new Map<string, number>();
        counts.set(game.lieu, venueCounts);
      }
      venueCounts.set(bracket, (venueCounts.get(bracket) ?? 0) + 1);
    }

    return {
      counts,
      brackets: [...brackets].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
    };
  });

  readonly maxGames = computed(() => _.max(this.parlieu().map(stat => stat.games)) ?? 0);
}