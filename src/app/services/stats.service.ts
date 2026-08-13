import { inject, Service } from "@angular/core";
import { SheetService } from "./sheet.service";
import { AllStats, Commander, Game, Stats } from "app/models/game.model";
import { forkJoin, map, Observable, of, ReplaySubject } from "rxjs";
import _, { Dictionary } from "lodash";


@Service()
export class StatsService {


    private sheets = inject(SheetService)
    private allStats = new ReplaySubject<AllStats>(1);


    public get stats(): Observable<AllStats> {
        return this.allStats.asObservable();
    }

    public initData(): Observable<boolean> {
        console.log('initData');
        // return of(true);
        return this.loadData()
            .pipe(
                map((data) => {
                    return this.calcStats(data);
                }),
                map((allStats) => {
                    this.allStats.next(allStats);
                    console.log('initData done');
                    return true;
                })
            );

    }

    private loadData(): Observable<{ games: Game[], commanders: Dictionary<Commander> }> {

        return forkJoin({ games: this.sheets.getGames(), commanders: this.sheets.getCommanders() }).pipe(
            map(data => ({
                games: data.games,
                commanders: _.chain(data.commanders).map(c => ([c.commander, c])).fromPairs().value()
            }))
        );
    }

    private calcStats(data: { games: Game[], commanders: Dictionary<Commander> }): AllStats {

        let cmrDictio = _.groupBy(data.games, "deck");

        let stats = _.chain(data.commanders).map((cmr, cmrName) => this.calcStatsForCommander(cmr, '', cmrDictio[cmr.commander])).value();

        let globals = new Stats();

        this.calcGlobals(stats, globals);

        let parLieu = this.calcStatsLieux(data.games);

        console.log('calcStats done');
        return new AllStats(data.games, data.commanders, stats, parLieu, globals);
    }

    calcStatsLieux(games: Game[]) {
        let lieuDictio = _.groupBy(games, "lieu");

        return _.chain(lieuDictio).map((values, lieu) => this.calcStatsForCommander(undefined, lieu, lieuDictio[lieu])).value();

    }
    private calcGlobals(stats: Stats[], res: Stats) {

        _.reduce(stats, (accu, value) => {
            accu.games += value.games;
            accu.wins += value.wins;
            accu.losses += value.losses;
            return accu;
        }, res);
        res.winrate = res.wins / res.games;
    }

    private calcStatsForCommander(cmr: Commander | undefined, lieu: string, games: Game[]): Stats {

        return _.reduce(games, (stat, game) => {
            stat.games++;
            if (game.gagnant) {
                stat.wins++;
            } else {
                stat.losses++;
            }
            stat.winrate = stat.wins / stat.games;

            return stat;
        }, new Stats(cmr, lieu));
    }
}