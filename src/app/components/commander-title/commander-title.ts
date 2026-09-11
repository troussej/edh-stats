import { Component, input } from '@angular/core';
import { ExternalLink } from '@primeicons/angular/external-link';
import { Commander } from 'app/models/game.model';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { Mana } from '../mana/mana';

import { TagModule, TagSeverity } from 'primeng/tag';
import { RouterLink } from "@angular/router";
import { OverlayBadgeModule } from 'primeng/overlaybadge';

@Component({
  selector: 'app-commander-title',
  imports: [AvatarModule, ExternalLink, TooltipModule, Mana, TagModule, RouterLink, OverlayBadgeModule],
  templateUrl: './commander-title.html',
  styleUrl: './commander-title.css',
})
export class CommanderTitle {


  public commander = input.required<Commander>();

  public readonly avatarSize = input('big');

  get avatarCss(): string {
    let res;
    switch (this.avatarSize()) {
      case 'small':
        res = "h-12! w-12!";
        break;
      case 'medium':
        res = "h-16! w-16!";
        break;
      case 'big':
      default:
        res = "h-22! w-22!";
        break;
    }
    return res;
  }

  public bracketSeverity(bracket: string): TagSeverity {
    switch (bracket) {
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
