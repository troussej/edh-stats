import { Component, input, Input } from '@angular/core';
import { ExternalLink } from '@primeicons/angular/external-link';
import { Commander } from 'app/models/game.model';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { Mana } from '../mana/mana';
import { Bracket } from "app/bracket/bracket";
import { TagModule } from 'primeng/tag';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-commander-title',
  imports: [AvatarModule, ExternalLink, TooltipModule, Mana, Bracket, TagModule, RouterLink],
  templateUrl: './commander-title.html',
  styleUrl: './commander-title.css',
})
export class CommanderTitle {

  useLink = input<boolean>(false);

  @Input()
  public commander!: Commander;

  @Input()
  public avatarSize = 'big';

  get avatarCss(): string {
    let res;
    switch (this.avatarSize) {
      case 'small':
        res = "h-8! w-8!";
        break;
      case 'medium':
        res = "h-12! w-12!";
        break;
      case 'big':
      default:
        res = "h-22! w-22!";
        break;
    }
    return res;
  }

}
