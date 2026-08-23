import { Component, Input } from '@angular/core';
import { Stats } from 'app/models/model';
import { ChartData, ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-pie-chart',
  imports: [BaseChartDirective],
  templateUrl: './pie-chart.html',
  styleUrl: './pie-chart.css',
})
export class PieChart {

  @Input({ required: true })
  public data!: Stats;

  public plugins: ChartConfiguration['plugins'] = [ChartDataLabels];

  public barChartOptions: ChartConfiguration['options'] = {

    plugins: {
      datalabels: {
        display: true,
        formatter: (value, ctx) => {
          const datapoints = ctx.chart.data.datasets[0].data
          const total = datapoints.reduce((total, datapoint) => (total as number) + (datapoint as number), 0)
          const percentage = value / (total as number) * 100
          return percentage.toFixed(2) + "%";
        },
        color: '#fff',
      }
    }
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
