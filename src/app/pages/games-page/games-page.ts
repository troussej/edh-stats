import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Table } from 'app/components/charts/stats-table/stats-table';
import { Options } from 'app/components/options/options';
import { StatsService } from 'app/services/stats.service';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ThumbsUp } from '@primeicons/angular/thumbs-up';
import { ThumbsDown } from '@primeicons/angular/thumbs-down';
import { EllipsisH } from '@primeicons/angular/ellipsis-h';
import { CommanderTitle } from 'app/components/commander-title/commander-title';
import { Commander } from 'app/models/game.model';

@Component({
  selector: 'app-games-page',
  imports: [CardModule, TableModule, Options, Table, DatePipe, ThumbsUp, ThumbsDown, EllipsisH, CommanderTitle],
  templateUrl: './games-page.html',
  styleUrl: './games-page.css',
})
export class GamesPage {

  private statsService = inject(StatsService);

  public games = computed(() => {
    // Replace the following line with the actual logic to compute stats

    const games = this.statsService.games();
    return games;
  });

  public cmr = computed<(deck: string) => Commander>(() => (deck: string) => {
    // Replace the following line with the actual logic to get the commander from the deck
    return this.statsService.commanders()[deck];

  });
}
