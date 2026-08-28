import _ from "lodash";

export interface Game {
    year: number,
    date: Date,
    lieu: string,
    deck: string,
    gagnant: boolean
}

export class Commander {

    constructor(
        public commander = '',
        public bracket = '',
        public url = '',
        public themes: string[] = [],
        public decklist = '',
        public debut = 0,
        public fin: number | undefined = undefined,
        public colors: string = ''

    ) {
    }

    public static from(other: any): Commander {
        return _.merge(new Commander(), other);
    }

    public isActive(year: number): boolean {
        return this.debut <= year && (_.isNil(this.fin) || this.fin >= year);
    }
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

