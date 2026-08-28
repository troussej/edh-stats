import { Component, Input } from '@angular/core';
import { MessageModule } from "primeng/message";
import { TagModule, TagSeverity } from 'primeng/tag';
import { MessageSeverity } from 'primeng/types/message';

@Component({
  selector: 'app-bracket',
  imports: [TagModule],
  templateUrl: './bracket.html',
  styleUrl: './bracket.css',
})
export class Bracket {

  @Input()
  value = '';

  public severity(): TagSeverity {
    switch (this.value) {
      case ('1'):
        return 'contrast';
      case ('2'):
        return 'info';
      case ('3'):
      case ('3+'):
        return 'warn';
      case ('4'):
        return 'danger';
      default:
        return 'contrast';
    }
  }
}
