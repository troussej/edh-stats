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
    themes: string[],
    decklist: string,
    debut: number,
    fin: number | undefined
}

export class Stats {
    // date: Date,
    constructor(
        public name = '',
        public games = 0,
        public wins = 0,
        public losses = 0,
        public winrate = 0
    ) { }

    calcWinrate() {
        this.winrate = this.wins / this.games;
    }
    get title() {
        return this.name;
    }
}

export class StatsPerCommander extends Stats {
    constructor(
        public commander: Commander
    ) {
        super();
    }

    override get title() {
        return this.commander.commander;
    }
}

export class StatsPerYear {
    constructor(
        public year: number,
        public games: Game[] = [],
        public parCommander: StatsPerCommander[] = [],
        public parLieu: Stats[] = [],
        public globals: Stats = new Stats()
    ) { }

}
