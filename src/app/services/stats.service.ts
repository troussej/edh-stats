import { Injectable } from "@angular/core";
import { SheetService } from "./sheet.service";
import { Commander, Game, Stats } from "app/models/game.model";
import { BehaviorSubject, combineLatest, forkJoin, map, Observable, of } from "rxjs";
import _, { Dictionary } from "lodash";


@Injectable({ providedIn: 'root' })
export class StatsService {

    public games: Game[] = [];
    public commanders: { [name: string]: Commander } = {};
    public stats: Stats[] = [];




    private ready = new BehaviorSubject<boolean>(false);



    constructor(private sheets: SheetService) {

    }

    public get isReady(): Observable<boolean> {
        return this.ready.asObservable();
    }

    public initData(): Observable<boolean> {
        console.log('initData');
        return this.loadData()
            .pipe(
                map(() => {
                    return this.calcStats();
                }),
                map(() => {
                    this.ready.next(true);
                    console.log('initData done');
                    return true;
                })
            );

    }

    private loadData(): Observable<boolean> {

        return forkJoin({ games: this.sheets.getGames(), commanders: this.sheets.getCommanders() }).pipe(
            map(data => {
                this.games = data.games;
                this.commanders = _.chain(data.commanders).map(c => ([c.commander, c])).fromPairs().value();
                console.log('loadData done');
                return true;
            })
        );
    }

    private calcStats(): boolean {

        let cmrDictio = _.groupBy(this.games, "deck");

        this.stats = _.chain(this.commanders).map((cmr, cmrName) => this.calcStatsForCommander(cmr, cmrDictio[cmr.commander])).value();
        console.log('calcStats done');
        return true;
    }

    private calcStatsForCommander(cmr: Commander, games: Game[]): Stats {

        return _.reduce(games, (stat, game) => {
            stat.games++;
            if (game.gagnant) {
                stat.wins++;
            } else {
                stat.losses++;
            }
            stat.winrate = stat.wins / stat.games;

            return stat;
        }, new Stats(cmr));
    }
}