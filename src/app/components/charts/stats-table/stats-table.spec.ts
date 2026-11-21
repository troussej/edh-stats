import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Stats } from 'app/models/game.model';

import { Table } from './stats-table';

describe('Table', () => {
  let component: Table;
  let fixture: ComponentFixture<Table>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Table]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Table);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('uses the total grid size and column spans for the header and rows', () => {
    component.sizeLeft = 2;
    component.sizeRight = 3;
    component.commanderCol = false;
    component.stats = [new Stats('Venue')];
    fixture.detectChanges();

    expect(component.sizeTotal()).toBe(6);
    for (const row of Array.from(fixture.nativeElement.querySelectorAll('thead tr, tbody tr') as NodeListOf<HTMLElement>)) {
      expect(row.classList.contains('grid-cols-6')).toBe(true);
      expect(row.children[0].classList.contains('col-span-2')).toBe(true);
      expect(row.children[2].classList.contains('col-span-3')).toBe(true);
      expect(row.style.gridTemplateColumns).toBe(component.gridColumns());
    }
  });

  it('shows Games before Winrate in either mode', () => {
    for (const mode of ['games', 'winrate'] as const) {
      component.mode = mode;
      fixture.detectChanges();
      const header = fixture.nativeElement.querySelectorAll('thead th')[1] as HTMLElement;
      const labels = Array.from(header.children)
        .map(element => element.textContent?.trim());
      expect(labels).toEqual(['Games', 'Winrate']);
    }
  });

  it('renders the title, game and winrate totals, and bar in separate columns', () => {
    component.commanderCol = false;
    component.title = 'Lieu';
    component.sortField = 'games';
    component.stats = [
      new Stats('First', 4, 2, 1, 2 / 3, 1),
      new Stats('Empty'),
    ];
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector('thead tr') as HTMLElement;
    expect(header.querySelectorAll('th').length).toBe(3);
    const rows = fixture.nativeElement.querySelectorAll('tbody tr') as NodeListOf<HTMLElement>;
    const cells = rows[0].querySelectorAll('td');
    expect(cells.length).toBe(3);
    expect(cells[0].textContent?.trim()).toBe('First');
    expect(cells[1].textContent).toContain('4G');
    expect(cells[1].textContent).toContain('67%');
    expect(cells[1].querySelector('app-winrate-bar')).toBeNull();
    expect(cells[2].querySelector('app-winrate-bar')).not.toBeNull();
    expect(rows[1].querySelectorAll('td')[1].textContent).toContain('0G');
    expect(rows[1].querySelectorAll('td')[1].textContent).toContain('0%');
  });
});
