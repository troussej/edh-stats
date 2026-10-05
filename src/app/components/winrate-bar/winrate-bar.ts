import { Component, computed, inject, input } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { Stats } from 'app/models/game.model';
import { ConfigService } from 'app/services/config.service';
@Component({
  selector: 'app-winrate-bar',
  imports: [TooltipModule],
  templateUrl: './winrate-bar.html',
  styleUrl: './winrate-bar.css',
})
export class WinrateBar {

  public config = inject(ConfigService).config;
  public stats = input.required<Stats>()
  public max = input<number>()

  public values = computed(() => {
    let total = this.stats().wins + this.stats().losses + this.stats().dnfs;

    let res = [
      {
        name: 'W',
        value: Math.round(this.stats().wins / total * 100),
        rate: Math.round(this.stats().wins / (this.stats().wins + this.stats().losses) * 100) + '%',
        count: this.stats().wins,
        class: 'bg-g rounded-l-lg',

      },
      {
        name: 'L',
        value: Math.round(this.stats().losses / total * 100),
        rate: Math.round(this.stats().losses / (this.stats().wins + this.stats().losses) * 100) + '%',
        count: this.stats().losses,
        class: 'bg-r',

      },
      {
        name: 'D',
        value: Math.round(this.stats().dnfs / total * 100),
        rate: '',
        count: this.stats().dnfs,
        class: 'bg-w rounded-r-lg',

      },
    ]

    const firstValue = res.find(r => r.value > 0);
    if (firstValue) {
      firstValue.class += ' rounded-l-lg';
    }
    const lastValue = res.slice().reverse().find(r => r.value > 0);
    if (lastValue) {
      lastValue.class += ' rounded-r-lg';
    }

    return res;
  })

  games = computed(() => {
    return this.stats().wins + this.stats().losses + this.stats().dnfs;
  });

  gamesPercentage = computed(() => {
    let total = this.games()
    return total / (this.max() ?? 1) * 100;
  });

}
