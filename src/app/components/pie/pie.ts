import { Component, Input } from '@angular/core';
import { Stats } from 'app/models/game.model';
import { ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
@Component({
  selector: 'app-pie',
  imports: [BaseChartDirective],
  templateUrl: './pie.html',
  styleUrl: './pie.css',
})
export class Pie {

  @Input({ required: true })
  public data!: Stats;

  public barChartOptions = {
  };


  get barChartData(): ChartData<'pie', number[], string | string[]> {
    return {
      labels: ['Wins', 'Losses'],
      datasets: [
        {
          data: [this.data.wins, this.data.losses],

        },
      ],
    };
  }
}
