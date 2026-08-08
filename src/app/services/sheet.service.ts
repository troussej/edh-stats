import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as config from "config/config.json";
import { map, Observable } from "rxjs";
import { parse } from "csv-parse/sync";
import { Commander, Game } from "app/models/game.model";
import * as _ from 'lodash';

@Injectable({ providedIn: 'root' })
export class SheetService {

    constructor(private http: HttpClient) {

    }


    public getGames(): Observable<Game[]> {
        const index = config.defaultYear as keyof typeof config.sheets;
        const url = config.sheets[index].games;
        console.log('getGames %s %s', index, url);
        return this.http.get(url, { responseType: "text" })
            .pipe(
                map(text => {
                    return this.parse(text);
                }),
                map(csv => _.map(csv, (line: any) =>
                ({

                    // date: new Date(Date.parse(line["Date"])),
                    lieu: line["Lieu"],
                    deck: line["Mon deck ?"],
                    gagnant: line["Gagnant ?"] === 'Y'
                })
                ))

            );
    }

    public getCommanders(): Observable<Commander[]> {
        const index = config.defaultYear as keyof typeof config.sheets;
        const url = config.sheets[index].commanders;
        console.log('getCommanders %s %s', index, url);
        return this.http.get(url, { responseType: "text" })
            .pipe(
                map(text => {
                    return this.parse(text);
                })
                ,
                map(csv => _.map(csv, (line: any) => ({

                    // date: new Date(Date.parse(line["Date"])),
                    commander: line["Commander"],
                    bracket: line["Mon Bracket ?"],
                    creationDate: line["Création"],
                    url: line["Image"],
                    themes: _.split(line["Thèmes"], ','),
                }
                )))

            );
    }



    public getThemes(): Observable<any> {
        return this.http.get(config.sheets[2025].themes, { responseType: "text" })
            .pipe(map(text => {
                return this.parse(text);
            }));
    }

    private parse(text: string) {
        return parse(text, {
            columns: true,
            skip_empty_lines: true,
        });
    }
}