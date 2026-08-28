export interface Game {
    year: number,
    date: Date,
    lieu: string,
    deck: string,
    gagnant: boolean
}

export interface Commander {

    commander: string,
    bracket: string,
    creationDate: boolean,
    url: string,
    themes: string[],
    decklist: string,
    debut: number,
    fin: number | undefined,
    colors: string
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

export class GlobalStats extends Stats {

    public gamesMovement?: boolean;
    public winMovement?: boolean;
    public lossMovement?: boolean;
    public winrateMovement?: boolean;

    get year(): number {
        return parseInt(this.title);
    }
}

export class StatsPerYear {
    constructor(
        public year: number,
        public games: Game[] = [],
        public parCommander: StatsPerCommander[] = [],
        public parLieu: Stats[] = [],
        public globals: GlobalStats = new GlobalStats()
    ) { }

}

export class CommanderStatPerYear {
    constructor(public commander: Commander, public stats: { [year: number]: Stats }) { }
}

