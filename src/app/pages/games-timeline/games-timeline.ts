import { Component } from '@angular/core';
import _ from 'lodash';
import { CardModule } from 'primeng/card';
import { PerLocation } from "app/components/charts/per-location/per-location";
import { Options } from 'app/components/options/options';

@Component({
  selector: 'app-games-timeline',
  imports: [CardModule, Options, PerLocation],
  templateUrl: './games-timeline.html',
  styleUrl: './games-timeline.css',
})
export class GamesTimeline {

}
