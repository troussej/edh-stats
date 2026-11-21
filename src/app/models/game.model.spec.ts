import { Stats } from './game.model';

describe('Stats', () => {
  it('calculates game count and rounded winrate from results', () => {
    const stats = new Stats('Test', 99, 2, 1, 0, 1);
    expect(stats.gameCount).toBe(4);
    expect(stats.winratePercentage).toBe(67);

    stats.wins = 0;
    stats.losses = 0;
    expect(stats.gameCount).toBe(1);
    expect(stats.winratePercentage).toBe(0);
  });
});
