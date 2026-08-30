import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommanderDetail } from './commander-detail';

describe('CommanderDetail', () => {
  let component: CommanderDetail;
  let fixture: ComponentFixture<CommanderDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommanderDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(CommanderDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
