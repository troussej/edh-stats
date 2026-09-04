import { Component, Input } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export type ChartDataInput =
  {
    labels: string[] | number[],
    datasets: {
      games: number[],
      winrate: number[],
    }
  };

@Component({
  selector: 'app-line-chart',
  imports: [BaseChartDirective],
  templateUrl: './line-chart.html',
  styleUrl: './line-chart.css',
})
export class LineChart {

  @Input({ required: true })
  chartData: ChartDataInput | null = null;

  public plugins: ChartConfiguration['plugins'] = [ChartDataLabels];

  options: ChartConfiguration['options'] = {

    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      datalabels: {
        color: '#fff',
        align: 'right',
        offset: 5,

      },

      title: {
        display: false,
        text: 'Stats',
      }
    },
    scales: {
      //winrate
      winrate: {
        type: 'linear',
        display: true,
        position: 'right',
        min: 0,
        max: 100,
      },
      games: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true,

        // grid line settings
        grid: {
          // drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
      },
    }


  };

  get data(): ChartConfiguration['data'] {
    return {
      labels: this.chartData?.labels ?? [],
      datasets: [
        {
          label: 'Winrate',
          data: this.chartData?.datasets.winrate ?? [],
          yAxisID: 'winrate',
          cubicInterpolationMode: 'monotone',
          datalabels: {
            formatter(value, context) {
              return value + '%'
            },
          }
        },
        {
          label: 'Games',
          data: this.chartData?.datasets.games ?? [],
          yAxisID: 'games',
          cubicInterpolationMode: 'monotone',
        }
      ]
    }
  }

}
