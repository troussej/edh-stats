import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecksTimeline } from './decks-timeline';

describe('DecksTimeline', () => {
  let component: DecksTimeline;
  let fixture: ComponentFixture<DecksTimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecksTimeline],
    }).compileComponents();

    fixture = TestBed.createComponent(DecksTimeline);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
