import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerLocation } from './per-location';

describe('PerLocation', () => {
  let component: PerLocation;
  let fixture: ComponentFixture<PerLocation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerLocation],
    }).compileComponents();

    fixture = TestBed.createComponent(PerLocation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
