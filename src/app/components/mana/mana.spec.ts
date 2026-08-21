import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mana } from './mana';

describe('Mana', () => {
  let component: Mana;
  let fixture: ComponentFixture<Mana>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mana],
    }).compileComponents();

    fixture = TestBed.createComponent(Mana);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
