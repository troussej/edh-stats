import { Component, computed, inject, Input } from '@angular/core';
import { Commander, StatsPerCommander } from 'app/models/game.model';
import { TagModule } from 'primeng/tag';
import { CommanderTitle } from '../commander-title/commander-title';
import { ChartDataInput, LineChart } from "../charts/line-chart/line-chart";
import { CardModule } from "primeng/card";
import { StatsService } from 'app/services/stats.service';
import _ from 'lodash';
import { FieldsetModule } from "primeng/fieldset";

@Component({
  selector: 'app-commander-card',
  imports: [TagModule, CommanderTitle, LineChart, CardModule, FieldsetModule],
  templateUrl: './commander-card.html',
  styleUrl: './commander-card.css',
})
export class CommanderCard {

  public statsService = inject(StatsService);

  @Input()
  cmr!: Commander;

  public chartData = computed<ChartDataInput>(() => {

    const statsPerYear = _.chain(this.statsService.games())
      .filter({ deck: this.cmr.commander })
      .groupBy('year')
      .mapValues((games, year) => this.statsService.calcStats(new StatsPerCommander(this.cmr), games))
      .value();

    return this.buildChartData(statsPerYear);

  });






  public buildChartData(data: {
    [year: number]: StatsPerCommander;
  }): ChartDataInput {

    return {
      labels: _.keys(data),
      datasets: {
        games: _.map(data, (stat) => stat.games),
        winrate: _.chain(data).map((stat) => stat.winrate * 100).map(n => _.round(n, 0)).value(),
      }
    };
  }

}
