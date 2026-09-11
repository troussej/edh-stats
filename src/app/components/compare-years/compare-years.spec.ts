import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareYears } from './compare-years';

describe('CompareYears', () => {
  let component: CompareYears;
  let fixture: ComponentFixture<CompareYears>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompareYears],
    }).compileComponents();

    fixture = TestBed.createComponent(CompareYears);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
