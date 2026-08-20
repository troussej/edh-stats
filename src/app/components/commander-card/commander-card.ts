import { Component, inject, Input } from '@angular/core';
import { Commander, StatsPerCommander } from 'app/models/game.model';
import { TagModule } from 'primeng/tag';
import { CommanderTitle } from '../commander-title/commander-title';
import { ChartDataInput, LineChart } from "../line-chart/line-chart";
import { CardModule } from "primeng/card";
import { StatsService } from 'app/services/stats.service';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import _ from 'lodash';

@Component({
  selector: 'app-commander-card',
  imports: [TagModule, CommanderTitle, LineChart, CardModule, AsyncPipe],
  templateUrl: './commander-card.html',
  styleUrl: './commander-card.css',
})
export class CommanderCard {

  public statsService = inject(StatsService);

  @Input()
  cmr!: Commander;

  public getChartData(): Observable<ChartDataInput> {

    return this.statsService.commandersData.pipe(map(data => {
      return this.buildChartData(data[this.cmr.commander]);
    }))


  }

  public buildChartData(data: {
    [year: number]: StatsPerCommander;
  }): ChartDataInput {

    return {
      labels: _.keys(data),
      datasets: {
        games: _.map(data, (stat) => stat.games),
        winrate: _.chain(data).map((stat) => stat.winrate * 100).map(n => _.round(n, 100)).value(),
      }
    };
  }

}
