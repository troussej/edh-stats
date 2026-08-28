import { computed, inject, Service, signal } from "@angular/core";
import { SheetService } from "./sheet.service";
import { Commander, Game, StatsPerCommander, StatsPerYear, Stats, GlobalStats } from "app/models/game.model";
import { forkJoin, map, Observable, of, ReplaySubject, pipe, mergeMap } from "rxjs";
import _, { Dictionary } from "lodash";
import { ConfigService } from "./config.service";


export type GameData = {
    games: {
        [year: number]: Game[];
    };
    commanders: Dictionary<Commander>;
};

export type StatPerCmrPerYear = {
    [cmr: string]: {
        [year: number]: StatsPerCommander;
    };
};

@Service()
export class StatsService {

    private config = inject(ConfigService).config;
    private sheets = inject(SheetService)

    public games = signal<Game[]>([]);
    public commandersS = signal<_.Dictionary<Commander>>({});

    // depreacted
    private allStats = new ReplaySubject<{ [year: number]: StatsPerYear }>(1);
    public cmrs = new ReplaySubject<_.Dictionary<Commander>>(1);
    private statsPerYear = new ReplaySubject<StatPerCmrPerYear>(1);

    public get stats(): Observable<{ [year: number]: StatsPerYear }> {
        return this.allStats.asObservable();
    }

    public get commanders(): Observable<_.Dictionary<Commander>> {
        return this.cmrs.asObservable();
    }

    get commandersData() {
        return this.statsPerYear.asObservable();
    }


    public initData(): Observable<boolean> {
        console.log('initData');
        // return of(true);
        return this.loadData()
            .pipe(
                map((data) => {
                    this.cmrs.next(data.commanders);
                    this.commandersS.set(data.commanders);
                    _.forEach(data.games, (games, year) => {
                        this.games.update(values => ([...values, ...games]))
                    });
                    return this.calcStatsAllYears(data);
                }),
                map((allStats) => {
                    this.allStats.next(allStats);
                    this.statsPerYear.next(this.buildCommanderStats(allStats));
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

    public calcStats<T extends Stats>(stat: T, games: Game[]): T {

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



    // transpose data cmr -> year -> stat
    private buildCommanderStats(stats: { [year: number]: StatsPerYear }): StatPerCmrPerYear {

        const accuRes: StatPerCmrPerYear = {};

        _.reduce(stats, (accu, stat) => {
            _.each(stat.parCommander, parCmr => {
                if (!accu[parCmr.title]) {
                    accu[parCmr.title] = {};
                }
                if (parCmr.commander.debut <= stat.year
                    && (parCmr.commander.fin == null || parCmr.commander.fin >= stat.year)) {
                    accu[parCmr.title][stat.year] = parCmr;
                }
            });
            return accu
        }, accuRes);

        return accuRes;
    }
}