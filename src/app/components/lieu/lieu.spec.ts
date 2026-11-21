import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Commander, Game, GameResult } from 'app/models/game.model';
import { SettingsService } from 'app/services/settings.service';
import { StatsService } from 'app/services/stats.service';

import { Lieu } from './lieu';

describe('Lieu', () => {
  let component: Lieu;
  let fixture: ComponentFixture<Lieu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lieu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lieu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays bracket counts below the winrate bar for each venue and updates filters', () => {
    const stats = TestBed.inject(StatsService);
    const settings = TestBed.inject(SettingsService);
    settings.currentYear.set(2026);
    stats.commanders.set({
      A: new Commander('A', '2', '', [], '', 2020),
      B: new Commander('B', '3', '', [], '', 2020),
    });
    const game = (lieu: string, deck: string, year = 2026): Game => ({
      lieu, deck, year, date: new Date(year, 0, 1), resultat: GameResult.WIN,
    });
    stats.games.set([
      game('Zoo', 'A'), game('Zoo', 'B'), game('Zoo', 'B'),
      game('Alpha', 'A'), game('Alpha', 'B', 2025),
    ]);
    fixture.detectChanges();

    const rows = () => Array.from(
      fixture.nativeElement.querySelectorAll('tbody tr') as NodeListOf<HTMLElement>,
    );
    expect(rows().map(row => row.querySelector('td')?.textContent?.trim())).toEqual(['Zoo', 'Alpha']);
    const zoo = rows()[0];
    expect(zoo.querySelector('app-winrate-bar')?.nextElementSibling?.tagName.toLowerCase())
      .toBe('app-bracket-bar');
    const labels = (row: HTMLElement) => Array.from(row.querySelectorAll('app-bracket-bar [aria-label]'))
      .map(label => label.getAttribute('aria-label'));
    expect(labels(zoo)).toEqual(['Bracket 2: 1 (33.3%)', 'Bracket 3: 2 (66.7%)']);
    expect(labels(rows()[1])).toEqual(['Bracket 2: 1 (100%)']);

    settings.bracketFilter.set(['2']);
    fixture.detectChanges();
    expect(rows().map(row => labels(row))).toEqual([['Bracket 2: 1 (100%)'], ['Bracket 2: 1 (100%)']]);

    settings.currentYear.set(2025);
    settings.bracketFilter.set(['3']);
    fixture.detectChanges();
    expect(rows().map(row => row.querySelector('td')?.textContent?.trim())).toEqual(['Alpha']);
    expect(labels(rows()[0])).toEqual(['Bracket 3: 1 (100%)']);
  });
});
