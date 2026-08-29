import { Component } from '@angular/core';
import _ from 'lodash';
import { CardModule } from 'primeng/card';
import { YearSelector } from 'app/year-selector/year-selector';
import { PerLocation } from "app/components/charts/per-location/per-location";

@Component({
  selector: 'app-games-timeline',
  imports: [CardModule, YearSelector, PerLocation],
  templateUrl: './games-timeline.html',
  styleUrl: './games-timeline.css',
})
export class GamesTimeline {

}
