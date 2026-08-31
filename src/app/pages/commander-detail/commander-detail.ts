import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from "primeng/card";
import { CommanderCard } from "app/components/commander-card/commander-card";
import { StatsService } from 'app/services/stats.service';
import { Commander, Filters } from 'app/models/game.model';
import { PerLocation } from "app/components/charts/per-location/per-location";
import { Options } from 'app/components/options/options';

@Component({
  selector: 'app-commander-detail',
  imports: [Options, CardModule, CommanderCard, PerLocation],
  templateUrl: './commander-detail.html',
  styleUrl: './commander-detail.css',
})
export class CommanderDetail {


  readonly cmrName: string;
  private route = inject(ActivatedRoute);
  private statsService = inject(StatsService);

  constructor() {
    this.cmrName = this.route.snapshot.paramMap.get('cmr') ?? '';
  }

  public commander = computed<Commander>(() => {
    return this.statsService.commanders()[this.cmrName];
  });

  filterPerLocation = computed<Filters>(() => ({ deck: this.commander().commander }));
}
