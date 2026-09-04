import { Component, computed, inject, input } from '@angular/core';
import { ConfigService } from 'app/services/config.service';
import { StatsService } from 'app/services/stats.service';
import { SettingsService } from 'app/services/settings.service';
import { ChartData, ChartConfiguration } from 'chart.js';
import _ from 'lodash';
import { BaseChartDirective } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Filters } from 'app/models/game.model';
import { Debug } from "app/debug/debug";

const monthLabels = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec'];

@Component({
  selector: 'app-per-location',
  imports: [BaseChartDirective, Debug],
  templateUrl: './per-location.html',
  styleUrl: './per-location.css',
})
export class PerLocation {

  public statsService = inject(StatsService);
  public settings = inject(SettingsService);
  public config = inject(ConfigService).config;

  public filters = input<Filters>({});

  public gamesData = computed(() => {

    let games = _.chain(this.statsService.games())
      .filter({ year: this.settings.currentYear() })
      .filter(this.filters())
      .filter(g => {
        const cmr = this.statsService.commanders()[g.deck];
        return this.settings.filterCommanders()(cmr);
      })
      .value();

    const indexOfMonths = Array.from({ length: 12 }, (e, i) => i);

    return _.chain(games).map(g => (
      { lieu: g.lieu, mois: g.date.getMonth() }
    ))
      .groupBy('lieu')
      .mapValues(val => _.countBy(val, 'mois'))
      .mapValues(val => {
        return _.map(indexOfMonths, i => val[i] ?? 0);
      })
      .map((val, lieu) =>
      ({
        label: lieu,
        data: val,
        borderRadius: 5,
        borderWidth: 3,
        yAxisID: 'games',
        stack: 'games',

      })
      )
      .value();
  })



  public winratePerMonth = computed(() => {

    let games = _.chain(this.statsService.games())
      .filter({ year: this.settings.currentYear() })
      .filter(this.filters())
      .filter(g => {
        const cmr = this.statsService.commanders()[g.deck];
        return this.settings.filterCommanders()(cmr);
      })
      .value();

    const indexOfMonths = Array.from({ length: 12 }, (e, i) => i);

    const winratePerMonth = _.chain(games).map(g => (
      { lieu: g.lieu, mois: g.date.getMonth(), win: g.gagnant ? 1 : 0 }
    ))
      .groupBy('mois')
      .mapValues(val => _.round(_.meanBy(val, 'win') * 100, 0))
      .value();
    return {
      label: 'Winrate',
      data: _.map(indexOfMonths, val => winratePerMonth[val] ?? 0),
      borderRadius: 5,
      borderWidth: 3,
      stack: 'winrate',
      yAxisID: 'winrate',
      datalabels: {
        formatter(value: string, context: any) {
          if (value) {
            return value + '%';
          }
          return '';
        },
      },
    };
  })

  public chartData = computed<ChartData<'pie', number[], string | string[]>>(() => {
    return {
      labels: monthLabels,
      datasets: [...this.gamesData(), this.winratePerMonth()]
    };
  });

  public plugins: ChartConfiguration['plugins'] = [ChartDataLabels];

  public barChartOptions: ChartConfiguration['options'] = {
    scales: {
      x: {
        stacked: true,
      },
      // y: {
      //   stacked: true,
      // },
      // y2: {
      //   stacked: false,
      // },
      winrate: {
        stacked: false,
        //   type: 'linear'
        // display: true,
        position: 'right',
        min: 0,
        max: 100,
      },
      games: {
        //  type: 'linear',
        stacked: true,
        // display: true,
        // position: 'left',
        // beginAtZero: true,


      },
    },
    plugins: {
      datalabels: {
        display: true,
        formatter: (value, ctx) => {
          if (value > 0) {
            return value;
          }
          return '';
        },
        color: '#fff',
      }
    }
  };

}
