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

  it('shows games and winrate in games mode and scales the bar by games', () => {
    fixture.detectChanges();

    const children = fixture.nativeElement.firstElementChild.children as HTMLCollectionOf<HTMLElement>;
    expect(children[0].textContent?.trim()).toBe('4G');
    expect(children[1].textContent?.trim()).toBe('67%');
    expect(children[2].style.width).toBe('50%');
  });

  it('shows games and winrate in winrate mode and scales the bar by winrate', () => {
    fixture.componentRef.setInput('mode', 'winrate');
    fixture.detectChanges();

    const children = fixture.nativeElement.firstElementChild.children as HTMLCollectionOf<HTMLElement>;
    expect(children[0].textContent?.trim()).toBe('4G');
    expect(children[1].textContent?.trim()).toBe('67%');
    expect(children[2].style.width).toBe('67%');
  });

  it('shows zero games and zero winrate when there are no games', () => {
    fixture.componentRef.setInput('stats', new Stats());
    fixture.detectChanges();

    const children = fixture.nativeElement.firstElementChild.children as HTMLCollectionOf<HTMLElement>;
    expect(children[0].textContent?.trim()).toBe('0G');
    expect(children[1].textContent?.trim()).toBe('0%');
  });
});
