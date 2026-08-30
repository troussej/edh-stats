import { JsonPipe } from '@angular/common';
import { Component, computed, input, Input } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { SolarizedColors } from 'app/preset';
import { Stats } from 'app/models/game.model';
import _ from 'lodash';

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



  public stats = input.required<Stats[]>();
  public maxSize = input<number>();
  public sortProp = input<string>();
  public sortOrder = input<'asc' | 'desc'>('asc');

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

  public convertToBarChartData = computed<BarChartDataInput>(
    () => {

      let max = this.maxSize() ?? this.stats().length;
      let data = this.stats();
      if (!_.isNil(this.sortProp())) {
        data = _.orderBy(data, s => s[this.sortProp()! as keyof Stats], this.sortOrder());
      }

      data = _.chain(data).slice(0, max).value();

      return {
        labels: _.map(data, d => d.title),
        datasets: {
          winrate: _.map(data, d => _.round(d.winrate * 100, 1)),
          games: _.map(data, d => d.games)
        }
      }
    });

  get data(): ChartConfiguration['data'] {

    const chartData = this.convertToBarChartData();

    return {
      labels: chartData?.labels ?? [],
      datasets: [
        {
          label: 'Winrate',
          data: chartData?.datasets.winrate ?? [],
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
          data: chartData?.datasets.games ?? [],
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


