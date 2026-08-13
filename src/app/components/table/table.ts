import { JsonPipe, AsyncPipe, PercentPipe } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Stats } from 'app/models/game.model';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { FieldsetModule } from 'primeng/fieldset';
import { Popover, PopoverModule } from 'primeng/popover';

@Component({
  selector: 'app-table',
  imports: [PercentPipe, CardModule, TableModule, ImageModule, AvatarModule, FieldsetModule, PopoverModule],
  templateUrl: './table.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './table.scss',
})
export class Table {

  @Input()
  public stats: Stats[] = [];

  @Input()
  public title = 'data';

  @Input()
  public sortField = 'winrate';

  @Input()
  public sortOrder = -1;

  @Input()
  public commanderCol = true;

  @Input()
  public lieuCol = false;

}
