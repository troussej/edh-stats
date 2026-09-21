import { Component, computed, inject, model } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from "primeng/card";
import { CommanderCard } from "app/components/commander-card/commander-card";
import { StatsService } from 'app/services/stats.service';
import { Commander, Filters } from 'app/models/game.model';
import { PerLocation } from "app/components/charts/per-location/per-location";
import { Options } from 'app/components/options/options';
import { SelectModule } from 'primeng/select';
import _ from 'lodash';

@Component({
  selector: 'app-commander-detail',
  imports: [Options, CardModule, CommanderCard, PerLocation, SelectModule],
  templateUrl: './commander-detail.html',
  styleUrl: './commander-detail.css',
})
export class CommanderDetail {


  readonly cmrName = model<string>('');
  private route = inject(ActivatedRoute);
  private statsService = inject(StatsService);
  private router = inject(Router);

  constructor() {
    this.cmrName.set(this.route.snapshot.paramMap.get('cmr') ?? '');
  }

  public commander = computed<Commander>(() => {
    return this.statsService.commanders()[this.cmrName()];
  });

  filterPerLocation = computed<Filters>(() => ({ deck: this.commander().commander }));



  public commanders = computed(() => {
    return _.chain(this.statsService.commanders())
      .map(g => g.commander)
      .sort()
      .uniq()
      .value();
  });

  public gotTo(event: any) {
    const commanderName = event.value;
    if (commanderName) {
      // Navigate to the commander detail page
      this.router.navigate(['/commander/', commanderName], { replaceUrl: true });
      this.cmrName.set(commanderName);
    }
  }
}
