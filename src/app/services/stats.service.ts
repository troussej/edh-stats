import { computed, inject, Service, signal } from "@angular/core";
import { SheetService } from "./sheet.service";
import { Commander, Game, StatsPerCommander, StatsPerYear, Stats, GlobalStats } from "app/models/game.model";
import { forkJoin, map, Observable, of, ReplaySubject, pipe, mergeMap } from "rxjs";
import _, { Dictionary } from "lodash";
import { ConfigService } from "./config.service";
import { SettingsService } from "app/settings.service";

@Service()
export class StatsService {

    private config = inject(ConfigService).config;
    private sheets = inject(SheetService);
    private settings = inject(SettingsService);

    public games = signal<Game[]>([]);
    public commanders = signal<_.Dictionary<Commander>>({});

    public initData(): Observable<boolean> {
        console.log('initData start');
        return this.loadData()
            .pipe(
                map((data) => {
                    this.commanders.set(data.commanders);
                    _.forEach(data.games, (games, year) => {
                        this.games.update(values => ([...values, ...games]))
                    });
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

    public activeCommanders = computed<_.Dictionary<Commander>>(() => {
        return _.chain(this.commanders())
            .filter((cmr, name) => cmr.isActive(this.settings.currentYear()))
            .map(cmr => [cmr.commander, cmr])
            .fromPairs()
            .value();
    });

}