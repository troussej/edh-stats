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

}
