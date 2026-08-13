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
    constructor(public commander?: Commander,
        public lieu = '',
        public games = 0,
        public wins = 0,
        public losses = 0,
        public winrate = 0
    ) { }

}

export class AllStats {
    constructor(
        public games: Game[] = [],
        public commanders: { [name: string]: Commander } = {},
        public allStats: Stats[] = [],
        public parLieu: Stats[] = [],
        public globals: Stats = new Stats()
    ) { }

}
