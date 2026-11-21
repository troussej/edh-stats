import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Tooltip } from 'primeng/tooltip';
import { BracketBar } from './bracket-bar';

describe('BracketBar', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [BracketBar] }).compileComponents();
  });

  it('scales the bar by games and displays nonzero bracket segments', () => {
    const fixture = TestBed.createComponent(BracketBar);
    fixture.componentRef.setInput('brackets', ['2', '3', '3+']);
    fixture.componentRef.setInput('counts', new Map([['2', 1], ['3+', 2]]));
    fixture.componentRef.setInput('max', 6);
    fixture.detectChanges();

    const bar = fixture.nativeElement.firstElementChild.firstElementChild as HTMLElement;
    const segments = bar.querySelectorAll(':scope > div');
    expect(bar.style.width).toBe('50%');
    expect(segments.length).toBe(2);
    expect(segments[0].textContent?.trim()).toBe('1 B2');
    expect(segments[1].textContent?.trim()).toBe('2 B3+');
    expect(parseFloat(segments[0].style.width)).toBeCloseTo(100 / 3);
    expect(parseFloat(segments[1].style.width)).toBeCloseTo(200 / 3);
    expect(segments[0].getAttribute('aria-label')).toBe('Bracket 2: 1 (33.3%)');
    expect(segments[1].getAttribute('aria-label')).toBe('Bracket 3+: 2 (66.7%)');
    const tooltips = fixture.debugElement.queryAll(By.directive(Tooltip))
      .map(element => element.injector.get(Tooltip).content());
    expect(tooltips).toEqual(['Bracket 2: 1 (33.3%)', 'Bracket 3+: 2 (66.7%)']);
    expect(fixture.nativeElement.querySelector('ul')).toBeNull();
  });

  it('handles an empty total without invalid percentages or widths', () => {
    const fixture = TestBed.createComponent(BracketBar);
    fixture.componentRef.setInput('brackets', ['2']);
    fixture.componentRef.setInput('counts', new Map<string, number>());
    fixture.componentRef.setInput('max', 0);
    fixture.detectChanges();

    const bar = fixture.nativeElement.firstElementChild.firstElementChild as HTMLElement;
    expect(bar.style.width).toBe('0%');
    expect(bar.children.length).toBe(0);
    expect(fixture.nativeElement.textContent?.trim()).toBe('');
  });
});
