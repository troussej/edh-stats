import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { YearSelector } from "app/components/year-selector/year-selector";
import { CardModule } from "primeng/card";
import { CommanderCard } from "app/components/commander-card/commander-card";
import { StatsService } from 'app/services/stats.service';
import { Commander, Filters } from 'app/models/game.model';
import { PerLocation } from "app/components/charts/per-location/per-location";

@Component({
  selector: 'app-commander-detail',
  imports: [YearSelector, CardModule, CommanderCard, PerLocation],
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
