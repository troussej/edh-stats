import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { StatsPerCommander, StatsPerYear } from 'app/models/game.model';
import { StatsService } from 'app/services/stats.service';
import { map, Observable, ReplaySubject } from 'rxjs';
import { TableModule } from "primeng/table";
import _ from 'lodash';
import { AvatarModule } from "primeng/avatar";
import { ChartDataInput, LineChart } from '../line-chart/line-chart';
import { FormsModule } from '@angular/forms';
import { ConfigService } from 'app/services/config.service';
import { CardModule } from "primeng/card";
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { CommanderTitle } from '../commander-title/commander-title';

type StatPerCmrPerYear = {
  [cmr: string]: {
    [year: number]: StatsPerCommander;
  };
};

@Component({
  selector: 'app-commanders',
  imports: [AsyncPipe, TableModule, AvatarModule, LineChart, JsonPipe, FormsModule, CardModule, InputTextModule, TagModule, CommanderTitle],
  templateUrl: './commanders.html',
  styleUrl: './commanders.css',
})
export class Commanders implements OnInit {

  public filter = '';

  public statsService = inject(StatsService);
  public config = inject(ConfigService).config;
  private statsPerYear = new ReplaySubject<StatPerCmrPerYear>(1);

  ngOnInit(): void {
    this.initData();
  }

  private initData(): void {
    this.statsService.stats.subscribe(data => {
      this.statsPerYear.next(this.buildCommanderStats(data));
    });
  }

  get commanders() {
    return this.statsService.commanders.pipe(map(data => _.values(data)));

  }

  get commandersData() {
    return this.statsPerYear.asObservable();
  }

  // transpose data cmr -> year -> stat
  private buildCommanderStats(stats: { [year: number]: StatsPerYear }): StatPerCmrPerYear {

    const accuRes: StatPerCmrPerYear = {};

    _.reduce(stats, (accu, stat) => {
      _.each(stat.parCommander, parCmr => {
        if (!accu[parCmr.title]) {
          accu[parCmr.title] = {};
        }
        if (parCmr.commander.debut <= stat.year
          && (parCmr.commander.fin == null || parCmr.commander.fin >= stat.year)) {
          accu[parCmr.title][stat.year] = parCmr;
        }
      });
      return accu
    }, accuRes);

    return accuRes;
  }

  public getChartData(name: string): Observable<ChartDataInput> {

    return this.commandersData.pipe(map(data => {
      return this.buildChartData(data[name]);
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
