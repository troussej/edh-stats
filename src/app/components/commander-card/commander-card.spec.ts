import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommanderCard } from './commander-card';

describe('CommanderCard', () => {
  let component: CommanderCard;
  let fixture: ComponentFixture<CommanderCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommanderCard],
    }).compileComponents();

    fixture = TestBed.createComponent(CommanderCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
