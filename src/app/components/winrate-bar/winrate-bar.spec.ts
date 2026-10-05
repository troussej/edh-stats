import { ComponentFixture, TestBed } from '@angular/core/testing';

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
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
