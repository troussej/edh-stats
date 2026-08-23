import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { StatsPerCommander, StatsPerYear } from 'app/models/game.model';
import { StatPerCmrPerYear, StatsService } from 'app/services/stats.service';
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
import { CommanderCard } from "../commander-card/commander-card";



@Component({
  selector: 'app-commanders',
  imports: [AsyncPipe, TableModule, AvatarModule, LineChart, JsonPipe, FormsModule, CardModule, InputTextModule, TagModule, CommanderTitle, CommanderCard],
  templateUrl: './commanders.html',
  styleUrl: './commanders.css',
})
export class Commanders {

  public filter = '';

  public statsService = inject(StatsService);
  public config = inject(ConfigService).config;


  get commanders() {
    return this.statsService.commanders.pipe(map(data =>
      _.chain(data).values().filter(c => c.commander.indexOf(this.filter) >= 0).value()
    ));

  }




}
