import { Component, Input } from '@angular/core';
import _ from 'lodash';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-mana',
  imports: [TagModule],
  templateUrl: './mana.html',
  styleUrl: './mana.css',
})
export class Mana {

  @Input()
  manaString = '';

  get symbols(): string[] {
    return _.values(this.manaString.toLowerCase());
  }

  public colorClass(s: string) {
    switch (s) {
      case 'w':
        return 'text-yellow-300';
      case 'u':
        return 'text-cyan-300';
      case 'b':
        return 'text-violet-300';;
      case 'r':
        return 'text-red-300';;
      case 'g':
        return 'text-green-300';;
    }
    return '';
  }
}
