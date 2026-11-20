import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Table } from 'app/components/charts/stats-table/stats-table';
import { Commander, StatsPerCommander } from 'app/models/game.model';

import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('includes commanders with fewer than three games in the winrate table', () => {
    const stats = [0, 1, 2, 3].map(games =>
      Object.assign(new StatsPerCommander(new Commander(`Commander ${games}`)), {
        games,
        winrate: games / 3,
      }),
    );
    component.statPerCommanderCurYear = signal(stats);
    fixture.detectChanges();

    const winrateTable = fixture.debugElement.queryAll(By.directive(Table))
      .map(element => element.componentInstance as Table)
      .find(table => table.mode === 'winrate');

    expect(component.perWinrate()).toEqual([...stats].reverse());
    expect(winrateTable?.stats).toEqual([...stats].reverse());
    expect(fixture.nativeElement.textContent).toContain('Par winrate');
    expect(fixture.nativeElement.textContent).not.toContain('plus de 3 parties');
  });

  it('orders equal winrates by games descending', () => {
    const stats = [
      new StatsPerCommander(new Commander('Few games')),
      new StatsPerCommander(new Commander('Higher winrate')),
      new StatsPerCommander(new Commander('Many games')),
      new StatsPerCommander(new Commander('Lower winrate')),
    ];
    Object.assign(stats[0], { games: 1, winrate: 0.5 });
    Object.assign(stats[1], { games: 1, winrate: 1 });
    Object.assign(stats[2], { games: 4, winrate: 0.5 });
    Object.assign(stats[3], { games: 10, winrate: 0 });
    component.statPerCommanderCurYear = signal(stats);

    expect(component.perWinrate()).toEqual([stats[1], stats[2], stats[0], stats[3]]);
  });

  it('orders equal game counts by winrate descending', () => {
    const stats = [
      new StatsPerCommander(new Commander('Lower winrate')),
      new StatsPerCommander(new Commander('More games')),
      new StatsPerCommander(new Commander('Higher winrate')),
      new StatsPerCommander(new Commander('Fewer games')),
    ];
    Object.assign(stats[0], { games: 3, winrate: 0.25 });
    Object.assign(stats[1], { games: 4, winrate: 0 });
    Object.assign(stats[2], { games: 3, winrate: 0.75 });
    Object.assign(stats[3], { games: 1, winrate: 1 });
    component.statPerCommanderCurYear = signal(stats);

    expect(component.perGames()).toEqual([stats[1], stats[2], stats[0], stats[3]]);
  });
});
