import { Component, computed, inject, model } from '@angular/core';
import { ExternalLink, PlusCircle, MinusCircle, ChevronDown, ChevronRight } from '@primeicons/angular';
import { TimelineModule } from 'primeng/timeline';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { StatsService } from 'app/services/stats.service';
import _ from 'lodash';
import { CardModule } from "primeng/card";
import { PanelModule } from 'primeng/panel';
import { RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigService } from 'app/services/config.service';
@Component({
  selector: 'app-decks-timeline',
  imports: [TimelineModule, PlusCircle, MinusCircle, PanelModule, CardModule, RouterLink,
    AvatarModule, NgTemplateOutlet, ToggleButtonModule, FormsModule,
    ChevronDown, ChevronRight],
  templateUrl: './decks-timeline.html',
  styleUrl: './decks-timeline.css',
})
export class DecksTimeline {

  public statsService = inject(StatsService);
  public config = inject(ConfigService).config;

  public extend = model(false);

  events = computed(() => {
    const commanders = this.statsService.commanders();
    let dates = [this.config.defaultYear];

    if (this.extend()) {
      dates = _.chain(commanders).values()

        .flatMap(c => [c.debut, c.fin])
        .filter(date => undefined !== date && date !== null)
        .uniq()
        .orderBy(date => date, 'desc')
        .value();
    }
    const byDebut = _.chain(commanders).values()
      .filter(c => undefined !== c.debut && c.debut !== null)
      .groupBy('debut')
      .value();

    const byFin = _.chain(commanders).values()
      .filter(c => undefined !== c.fin && c.fin !== null)
      .groupBy('fin')
      .value();

    return _.chain(dates)
      .map(date => ({
        date,
        creations: byDebut[date] || [],
        destructions: byFin[date] || []
      }))
      .value();
  });
}
