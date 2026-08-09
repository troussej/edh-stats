import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lieu } from './lieu';

describe('Lieu', () => {
  let component: Lieu;
  let fixture: ComponentFixture<Lieu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lieu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lieu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
