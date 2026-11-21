import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Stats } from 'app/models/game.model';

import { WinrateBar } from './winrate-bar';

describe('WinrateBar', () => {
  let component: WinrateBar;
  let fixture: ComponentFixture<WinrateBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WinrateBar],
    }).compileComponents();

    fixture = TestBed.createComponent(WinrateBar);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('stats', new Stats('', 4, 2, 1, 2 / 3, 1));
    fixture.componentRef.setInput('max', 8);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('scales the bar by games in games mode', () => {
    fixture.detectChanges();

    const children = fixture.nativeElement.firstElementChild.children as HTMLCollectionOf<HTMLElement>;
    expect(children.length).toBe(1);
    expect(children[0].style.width).toBe('50%');
  });

  it('scales the bar by winrate in winrate mode', () => {
    fixture.componentRef.setInput('mode', 'winrate');
    fixture.detectChanges();

    const children = fixture.nativeElement.firstElementChild.children as HTMLCollectionOf<HTMLElement>;
    expect(children[0].style.width).toBe('67%');
  });

  it('calculates zero games and zero winrate when there are no games', () => {
    fixture.componentRef.setInput('stats', new Stats());
    fixture.detectChanges();

    expect(component.games()).toBe(0);
    expect(component.winratePercentage()).toBe(0);
  });
});
