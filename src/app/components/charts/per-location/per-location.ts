import { Component, computed, inject, input } from '@angular/core';
import { ConfigService } from 'app/services/config.service';
import { StatsService } from 'app/services/stats.service';
import { SettingsService } from 'app/settings.service';
import { ChartData, ChartConfiguration } from 'chart.js';
import _ from 'lodash';
import { BaseChartDirective } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Filters } from 'app/models/game.model';


@Component({
  selector: 'app-per-location',
  imports: [BaseChartDirective],
  templateUrl: './per-location.html',
  styleUrl: './per-location.css',
})
export class PerLocation {

  public statsService = inject(StatsService);
  public settings = inject(SettingsService);
  public config = inject(ConfigService).config;

  public filters = input<Filters>({});

  public data = computed(() => {

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
        borderWidth: 3

      })
      )
      .value();
  })

  public chartData = computed<ChartData<'pie', number[], string | string[]>>(() => {
    return {
      labels: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec'],
      datasets: this.data()
    };
  });

  public plugins: ChartConfiguration['plugins'] = [ChartDataLabels];

  public barChartOptions: ChartConfiguration['options'] = {
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true
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
