import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Commander } from 'app/models/game.model';
import { StatsService } from 'app/services/stats.service';
import { map, Observable } from 'rxjs';
import { TableModule } from "primeng/table";
import _ from 'lodash';
import { AvatarModule } from "primeng/avatar";

@Component({
  selector: 'app-commanders',
  imports: [AsyncPipe, TableModule, AvatarModule],
  templateUrl: './commanders.html',
  styleUrl: './commanders.css',
})
export class Commanders {

  public statsService = inject(StatsService);

  get commanders(): Observable<Commander[]> {
    return this.statsService.commanders.pipe(map(d => _.values(d)));
  }
}
