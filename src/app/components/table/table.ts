import { JsonPipe, AsyncPipe, PercentPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Stats } from 'app/models/game.model';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { Popover, PopoverModule } from 'primeng/popover';

@Component({
  selector: 'app-table',
  imports: [PercentPipe, CardModule, TableModule, ImageModule, AvatarModule, PopoverModule],
  templateUrl: './table.html',
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
