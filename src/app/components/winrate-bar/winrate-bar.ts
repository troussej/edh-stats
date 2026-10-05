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

  public values = computed(() => {
    let total = this.stats().wins + this.stats().losses + this.stats().dnfs;

    let res = [
      {
        name: 'W',
        value: Math.round(this.stats().wins / total * 100),
        count: this.stats().wins,
        class: 'bg-g rounded-l-lg',

      },
      {
        name: 'L',
        value: Math.round(this.stats().losses / total * 100),
        count: this.stats().losses,
        class: 'bg-r',

      },
      {
        name: 'dnf',
        value: Math.round(this.stats().dnfs / total * 100),
        count: this.stats().dnfs,
        class: 'bg-w rounded-r-lg',

      },
    ]
    if (res[2].value === 0) {
      res[1].class += ' rounded-r-lg';
    }
    return res;
  })

}
