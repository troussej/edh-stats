import { inject, Service } from "@angular/core";
import { SheetService } from "./sheet.service";
import { Commander, Game, StatsPerCommander, StatsPerYear, Stats, GlobalStats } from "app/models/game.model";
import { forkJoin, map, Observable, of, ReplaySubject, pipe, mergeMap } from "rxjs";
import _, { Dictionary } from "lodash";
import { ConfigService } from "./config.service";


type GameData = {
    games: {
        [year: number]: Game[];
    };
    commanders: Dictionary<Commander>;
};

@Service()
export class StatsService {

    private config = inject(ConfigService).config;
    private sheets = inject(SheetService)
    private allStats = new ReplaySubject<{ [year: number]: StatsPerYear }>(1);
    public cmrs = new ReplaySubject<_.Dictionary<Commander>>(1);



    public get stats(): Observable<{ [year: number]: StatsPerYear }> {
        return this.allStats.asObservable();
    }

    public get commanders(): Observable<_.Dictionary<Commander>> {
        return this.cmrs.asObservable();
    }

    public initData(): Observable<boolean> {
        console.log('initData');
        // return of(true);
        return this.loadData()
            .pipe(
                map((data) => {
                    this.cmrs.next(data.commanders);
                    return this.calcStatsAllYears(data);
                }),
                map((allStats) => {
                    this.allStats.next(allStats);
                    console.log('initData done');
                    return true;
                })
            );

    }

    private loadData(): Observable<{ games: { [year: number]: Game[] }, commanders: Dictionary<Commander> }> {

        return forkJoin({
            commanders: this.sheets.getCommanders(),
            games: this.loadGamesData()
        }).pipe(
            map(data => {
                return {
                    games: data.games,
                    commanders: _.chain(data['commanders']).map(c => ([c.commander, c])).fromPairs().value()
                }
            })
        );
    }

    private loadGamesData(): Observable<{ [year: number]: Game[] }> {

        const obsMap = _.chain(this.config.years)
            .map(y => {

                return [y, this.sheets.getGames(y, y === this.config.defaultYear)];

            })
            .fromPairs().value();

        return forkJoin(obsMap).pipe(
            map(data => {
                return _.chain(data).map((games, year) => [year, games]).fromPairs().value();
            })
        );


    }

    private calcStatsAllYears(data: GameData): { [year: number]: StatsPerYear } {
        const res = _.chain(this.config.years)
            .map((year) => [year, this.calcStatsPerYear(year, data.games[year], data.commanders)])
            .fromPairs().value();
        this.calcMovementFromPrevYear(res);
        return res;
    }

    private calcStatsPerYear(year: number, gamesForYear: Game[], commanders: Dictionary<Commander>): StatsPerYear {

        let gamesPerCommander = _.groupBy(gamesForYear, "deck");
        let statsPerCommander = _.chain(commanders).map((cmr, cmrName) => this.calcStats(new StatsPerCommander(cmr), gamesPerCommander[cmr.commander])).value();

        const globals = this.calcStats(new GlobalStats(year.toString()), gamesForYear);

        let parLieu = this.calcStatsLieux(gamesForYear);

        console.log('calcStatsPerYear done');
        return new StatsPerYear(year, gamesForYear, statsPerCommander, parLieu, globals);
    }

    calcStatsLieux(games: Game[]) {
        let lieuDictio = _.groupBy(games, "lieu");

        return _.chain(lieuDictio).map((values, lieu) => this.calcStats(new Stats(lieu), values)).value();

    }

    private calcStats<T extends Stats>(stat: T, games: Game[]): T {

        const res = _.reduce(games, (stat, game) => {
            stat.games++;
            if (game.gagnant) {
                stat.wins++;
            } else {
                stat.losses++;
            }
            return stat;
        }, stat);

        res.calcWinrate();
        return res;
    }

    calcMovementFromPrevYear(data: { [year: number]: StatsPerYear }) {

        _.forEach(this.config.years, year => {
            if (data[year - 1]) {

                const current = data[year].globals;
                const prev = data[year - 1].globals;

                current.gamesMovement = current.games > prev.games;
                current.winMovement = current.wins > prev.wins;
                current.lossMovement = current.losses > prev.losses;
                current.winrateMovement = current.winrate > prev.winrate;
            }
        })

        return data;
    }
}