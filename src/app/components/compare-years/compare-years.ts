import { Component, computed, inject } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { SettingsService } from 'app/services/settings.service';
import { StatsService } from 'app/services/stats.service';
import _ from 'lodash';
import { Game, GameResult } from '../../models/game.model';
import { Debug } from 'app/debug/debug';
import { ChartData, ChartConfiguration, ChartDataset, plugins, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const monthLabels = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec'];

type AccumulatedMonthStat = {
  accumulatedGames: number;
  accumulatedWins: number;
  accumulatedWinrate: number;
  games: number;
  wins: number;
  winrate: number;
  month: number;
};

@Component({
  selector: 'app-compare-years',
  imports: [Debug, BaseChartDirective],
  templateUrl: './compare-years.html',
  styleUrl: './compare-years.css',
})
export class CompareYears {


  public statsService = inject(StatsService);
  settings = inject(SettingsService);

  public filteredGames = computed(() => {
    return _.chain(this.statsService.games())
      .filter(this.settings.filterByLieu())
      .filter(g => {
        const cmr = this.statsService.commanders()[g.deck];

        return this.settings.filterCommandersByName()(cmr)
          && this.settings.filterCommandersByBracket()(cmr);

      })
      .value();
  });


  public data = computed(() => {
    return _.chain(this.filteredGames())
      .groupBy(game => game.date.getFullYear())
      .mapValues(this.calcCumulatedStat)
      .value()
  });

  calcCumulatedStat(games: Game[]) {

    let resultPerMonth = _.chain(games)
      .groupBy(g => g.date.getMonth())
      .mapValues((games: Game[]) => {
        return {
          games: _.sumBy(games, g => g.resultat !== GameResult.DNF ? 1 : 0),
          wins: _.sumBy(games, g => g.resultat === GameResult.WIN ? 1 : 0),
          winrate: Math.round((games.length > 0 ? _.sumBy(games, g => g.resultat === GameResult.WIN ? 1 : 0) / _.sumBy(games, g => g.resultat !== GameResult.DNF ? 1 : 0) : 0) * 100) || 0
        }
      })
      //  .map((val, month) => ({ month: parseInt(month), ...val }))

      .value();
    const indexOfMonths = Array.from({ length: 12 }, (e, i) => i);

    const resultPerMonthArray = _.chain(indexOfMonths)
      .map((month) => ({ month, ...resultPerMonth[month] }))
      .value();

    return _.chain(resultPerMonthArray).reduce((acc, v) => {
      const last = _.last(acc);

      const accuForMonth = {
        accumulatedGames: (last?.accumulatedGames || 0) + (v.games ?? 0),
        accumulatedWins: (last?.accumulatedWins || 0) + (v.wins ?? 0),
        accumulatedWinrate: 0,
        ...v
      }
      accuForMonth.accumulatedWinrate = accuForMonth.accumulatedGames > 0 ? Math.round((accuForMonth.accumulatedWins / accuForMonth.accumulatedGames) * 100) : 0;
      acc.push(accuForMonth);
      return acc;
    }, [] as AccumulatedMonthStat[])
      .value();
  }

  public gamesAccuChartData = computed(() => {
    return this.getChartData(this.data(),
      (year: number, yearData: AccumulatedMonthStat[]) =>
        this.buildGamesDataset(year, yearData.map((v: AccumulatedMonthStat) => v.accumulatedGames)));
  });

  public winrateAccuChartData = computed(() => {
    return this.getChartData(this.data(),
      (year: number, yearData: AccumulatedMonthStat[]) =>
        this.buildWinrateDataset(year, yearData.map((v: AccumulatedMonthStat) => v.accumulatedWinrate)));
  });

  public gamesChartData = computed(() => {
    return this.getChartData(this.data(),
      (year: number, yearData: AccumulatedMonthStat[]) =>
        this.buildGamesDataset(year, yearData.map((v: AccumulatedMonthStat) => v.games)));
  });

  public winrateChartData = computed(() => {
    return this.getChartData(this.data(),
      (year: number, yearData: AccumulatedMonthStat[]) =>
        this.buildWinrateDataset(year, yearData.map((v: AccumulatedMonthStat) => v.winrate)));
  });

  public getChartData(data: Record<string, AccumulatedMonthStat[]>, dataSetFc: (year: number, yearData: AccumulatedMonthStat[]) => ChartDataset): { labels: string[]; datasets: ChartDataset[] } {
    // const data = this.data();
    const years = Object.keys(data);
    const datasets: ChartDataset[] = [];

    years.forEach(year => {
      const yearData = data[year];
      datasets.push(dataSetFc(parseInt(year), yearData));
    });

    return {
      labels: monthLabels,
      datasets
    };
  };


  public buildWinrateDataset(year: number, data: number[]): ChartDataset {

    return {
      label: '' + year,

      data: data,
      yAxisID: 'winrate',
      cubicInterpolationMode: 'monotone',
      spanGaps: true,
      datalabels: {
        formatter(value, context) {
          return value + '%'
        },
      }
    }
  }

  public buildGamesDataset(year: number, data: number[]): ChartDataset {
    return {
      label: '' + year,
      data: data,
      yAxisID: 'games',
      cubicInterpolationMode: 'monotone',
      spanGaps: true,
    };
  }


  public plugins: ChartConfiguration['plugins'] = []// [ChartDataLabels];

  public optionsWinrate: (title: string) => ChartConfiguration['options'] = (title: string) => {
    return {
      responsive: true,
      keepAspectRatio: true,

      plugins: {
        title: {
          display: true,
          text: title,
        },
        // Tooltip
        tooltip: {
          mode: 'index',
        }
      },
      scales: {
        //winrate
        winrate: {
          type: 'linear',
          display: true,
          position: 'right',

          // min: 0,
          // max: 100,
          ticks: {
            callback: (value) => value + '%'
          }

        }

      }

    };
  };

  public optionsGames: (title: string) => ChartConfiguration['options'] = (title: string) => {
    return {
      responsive: true,
      keepAspectRatio: true,
      plugins: {
        title: {
          display: true,
          text: title,
        },
        // Tooltip
        tooltip: {
          intersect: false,
          mode: 'index',
          axis: 'x'
        }
      },
      scales: {
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
    }
  };
};  
