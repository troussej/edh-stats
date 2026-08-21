import { JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { SolarizedColors } from 'app/preset';

export type BarChartDataInput =
  {
    labels: string[] | number[],
    datasets: {
      games: number[],
      winrate: number[],
    }
  };


@Component({
  selector: 'app-bar-chart',
  imports: [BaseChartDirective],
  templateUrl: './bar-chart.html',
  styleUrl: './bar-chart.css',
})
export class BarChart {


  @Input({ required: true })
  chartData: BarChartDataInput | null = null;

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
          datalabels: {
            formatter(value, context) {
              return value + '%'
            },
          },
          borderRadius: 5,
          borderWidth: 3
          // backgroundColor: SolarizedColors.magenta


        },
        {
          label: 'Games',
          data: this.chartData?.datasets.games ?? [],
          yAxisID: 'games',
          borderRadius: 5,
          borderWidth: 3
          // backgroundColor: SolarizedColors.cyan
          // borderColor: '#fff',
        }
      ]
    }
  }

}
