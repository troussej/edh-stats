import { PercentPipe } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Stats } from 'app/models/game.model';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { SortableColumn, TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { FieldsetModule } from 'primeng/fieldset';
import { PopoverModule } from 'primeng/popover';
import { TooltipModule } from 'primeng/tooltip';
import { CommanderTitle } from "../commander-title/commander-title";
@Component({
  selector: 'app-table',
  imports: [PercentPipe, CardModule, TableModule, ImageModule, AvatarModule, FieldsetModule, PopoverModule, TooltipModule, CommanderTitle, SortableColumn],
  templateUrl: './table.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './table.css',
})
export class Table {

  @Input()
  public stats: Stats[] = [];

  @Input()
  public legend = 'data';

  @Input()
  public sortField = 'winrate';

  @Input()
  public sortOrder = -1;

  @Input()
  public commanderCol = true;

  @Input()
  public title = '';

}
