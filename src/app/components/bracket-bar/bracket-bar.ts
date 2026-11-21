import { PercentPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-bracket-bar',
  imports: [PercentPipe],
  templateUrl: './bracket-bar.html',
})
export class BracketBar {
  readonly brackets = input.required<readonly string[]>();
  readonly counts = input.required<ReadonlyMap<string, number>>();
  readonly max = input.required<number>();

  readonly total = computed(() =>
    [...this.counts().values()].reduce((sum, count) => sum + count, 0),
  );

  readonly values = computed(() => this.brackets().map(bracket => {
    const count = this.counts().get(bracket) ?? 0;
    return {
      bracket,
      count,
      fraction: this.total() > 0 ? count / this.total() : 0,
      color: this.colors[bracket] ?? '#d1d5db',
    };
  }));

  readonly barWidth = computed(() => this.max() > 0 ? this.total() / this.max() * 100 : 0);

  private readonly colors: Readonly<Record<string, string>> = {
    '1': '#e5e7eb',
    '2': '#86efac',
    '3': '#93c5fd',
    '3+': '#c4b5fd',
    '4': '#fca5a5',
  };
}
