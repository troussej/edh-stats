export interface Game {
    // date: Date,
    lieu: string,
    deck: string,
    gagnant: boolean
}

export interface Commander {
    // date: Date,
    commander: string,
    bracket: string,
    creationDate: boolean,
    url: string,
    themes: string[]
}

export class Stats {
    // date: Date,
    constructor(public commander: Commander,
        public games = 0,
        public wins = 0,
        public losses = 0,
        public winrate = 0) { }

}