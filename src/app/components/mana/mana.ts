import { Component, Input } from '@angular/core';
import { MessageModule } from 'primeng/message';
import _ from 'lodash';

@Component({
  selector: 'app-mana',
  imports: [MessageModule],
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
