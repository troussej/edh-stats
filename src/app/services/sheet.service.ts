import { HttpClient } from "@angular/common/http";
import { inject, Injectable, Service } from "@angular/core";
import { map, Observable, of } from "rxjs";
import * as Papa from 'papaparse';
import { Commander, Game } from "app/models/game.model";
import * as _ from 'lodash';
import { ConfigService } from "./config.service";

@Service()
export class SheetService {

    private http: HttpClient = inject(HttpClient);
    private config = inject(ConfigService).config;


    public getGames(year: number, googlesheet = true): Observable<Game[]> {
        const index = year as keyof typeof this.config.data;
        let url = '';
        if (googlesheet) {
            url = this.config.data[index].games;
        } else {
            url = '/cache/games-' + year + '.csv';
        }
        console.log('getGames %s %s', index, url);
        return this.getGamesParUrl(url);
    }

    public getGamesParUrl(url: string): Observable<Game[]> {

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
        const url = this.config.commanders;
        console.log('getCommanders %s %s', url);
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

    private parse(text: string) {
        let data = Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
        }).data;

        console.log('parse done', data);
        return data;
    }
}