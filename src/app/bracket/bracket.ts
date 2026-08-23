import { Component, Input } from '@angular/core';
import { MessageModule } from "primeng/message";
import { MessageSeverity } from 'primeng/types/message';

@Component({
  selector: 'app-bracket',
  imports: [MessageModule],
  templateUrl: './bracket.html',
  styleUrl: './bracket.css',
})
export class Bracket {

  @Input()
  value = '';

  public severity(): MessageSeverity {
    switch (this.value) {
      case ('1'):
        return 'contrast';
      case ('2'):
        return 'info';
      case ('3'):
      case ('3+'):
        return 'warn';
      case ('4'):
        return 'error';
      default:
        return 'contrast';
    }
  }
}
