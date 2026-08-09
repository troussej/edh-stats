import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalStats } from './global-stats';

describe('GlobalStats', () => {
  let component: GlobalStats;
  let fixture: ComponentFixture<GlobalStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalStats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalStats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
