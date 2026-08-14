import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Commanders } from './commanders';

describe('Commanders', () => {
  let component: Commanders;
  let fixture: ComponentFixture<Commanders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Commanders],
    }).compileComponents();

    fixture = TestBed.createComponent(Commanders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
