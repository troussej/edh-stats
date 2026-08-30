import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesTimeline } from './games-timeline';

describe('GamesTimeline', () => {
  let component: GamesTimeline;
  let fixture: ComponentFixture<GamesTimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesTimeline],
    }).compileComponents();

    fixture = TestBed.createComponent(GamesTimeline);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
