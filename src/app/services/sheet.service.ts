import { HttpClient } from "@angular/common/http";
import { inject, Injectable, Service } from "@angular/core";
import { map, Observable, of } from "rxjs";
import * as Papa from 'papaparse';
import { Commander, Game } from "app/models/game.model";
import * as _ from 'lodash';
import { ConfigService } from "./config.service";
import { LocationStrategy } from "@angular/common";

@Service()
export class SheetService {

    private http: HttpClient = inject(HttpClient);
    private locationStrategy = inject(LocationStrategy);
    private config = inject(ConfigService).config;


    public getGames(year: number, googlesheet = true): Observable<Game[]> {
        const index = year as keyof typeof this.config.data;
        let url = '';
        if (googlesheet) {
            url = this.config.data[index].games;
        } else {
            url = 'cache/games-' + year + '.csv';
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
                map(csv => _.map(csv, (line: any) => {

                    let dateString = line["Date"].split('/');
                    return {

                        date: new Date(dateString[2], dateString[1], dateString[0]),
                        lieu: line["Lieu"],
                        deck: line["Mon deck ?"],
                        gagnant: line["Gagnant ?"] === 'Y'

                    }
                }
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


                    commander: line["Commander"],
                    bracket: line["Bracket"],
                    creationDate: line["Création"],
                    url: line["Image"],
                    decklist: line["Decklist"],
                    debut: parseInt(line["Création"]),
                    fin: line["Fin"] ? parseInt(line["Fin"]) : undefined,
                    themes: _.split(line["Thèmes"], ','),
                    colors: line["Colors"]
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