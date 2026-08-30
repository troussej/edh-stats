import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerBracket } from './per-bracket';

describe('PerBracket', () => {
  let component: PerBracket;
  let fixture: ComponentFixture<PerBracket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerBracket],
    }).compileComponents();

    fixture = TestBed.createComponent(PerBracket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
