import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommanderTitle } from './commander-title';

describe('CommanderTitle', () => {
  let component: CommanderTitle;
  let fixture: ComponentFixture<CommanderTitle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommanderTitle],
    }).compileComponents();

    fixture = TestBed.createComponent(CommanderTitle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
