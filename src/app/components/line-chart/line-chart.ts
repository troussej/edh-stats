import { JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';


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
  imports: [BaseChartDirective, JsonPipe],
  templateUrl: './line-chart.html',
  styleUrl: './line-chart.css',
})
export class LineChart {

  @Input({ required: true })
  chartData: ChartDataInput | null = null;

  options: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {

      title: {
        display: false,
        text: 'Stats',
      }
    },
    scales: {
      //winrate
      y: {
        type: 'linear',
        display: true,
        position: 'right',
        min: 0,
        max: 100,
      },
      y1: {
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
          yAxisID: 'y',
        },
        {
          label: 'Games',
          data: this.chartData?.datasets.games ?? [],
          yAxisID: 'y1',
        }
      ]
    }
  }

}
