import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ConfigService } from 'app/services/config.service';
import { StatsService } from 'app/services/stats.service';
import { ChartConfiguration, ChartData } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import _ from 'lodash';
import { BaseChartDirective } from 'ng2-charts';
import { CardModule } from 'primeng/card';
import { map, Observable } from 'rxjs';
import { RadioButton } from "primeng/radiobutton";
import { FormsModule } from '@angular/forms';
import { SettingsService } from 'app/settings.service';

@Component({
  selector: 'app-games-timeline',
  imports: [BaseChartDirective, CardModule, AsyncPipe, JsonPipe, RadioButton, FormsModule],
  templateUrl: './games-timeline.html',
  styleUrl: './games-timeline.css',
})
export class GamesTimeline {
  public statsService = inject(StatsService);
  public settings = inject(SettingsService);
  public config = inject(ConfigService).config;

  public data = computed(() => {

    let games = _.chain(this.statsService.games())
      .filter({ year: this.settings.currentYear() })
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
        // type: 'linear',
        // display: true,
        // position: 'left',
        // beginAtZero: true,
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
