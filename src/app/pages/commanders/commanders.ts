import { Component, computed, inject, model } from '@angular/core';
import { StatsService } from 'app/services/stats.service';
import { TableModule } from "primeng/table";
import _, { values } from 'lodash';
import { AvatarModule } from "primeng/avatar";
import { FormsModule } from '@angular/forms';
import { ConfigService } from 'app/services/config.service';
import { CardModule } from "primeng/card";
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { CommanderCard } from 'app/components/commander-card/commander-card';
import { SelectButtonModule } from 'primeng/selectbutton';




@Component({
  selector: 'app-commanders',
  imports: [TableModule, AvatarModule, FormsModule, CardModule, InputTextModule, TagModule, CommanderCard, SelectButtonModule],
  templateUrl: './commanders.html',
  styleUrl: './commanders.css',
})
export class Commanders {

  public filter = '';

  public statsService = inject(StatsService);
  public config = inject(ConfigService).config;

  public brackets = [
    {
      name: 'B2',
      value: '2'
    },
    {
      name: 'B3',
      value: '3'
    },
    {
      name: 'B3+',
      value: '3+'
    },
    {
      name: 'B4',
      value: '4'
    },

  ]
  public bracketFilter = model<string[]>(['2', '3', '3+', '4',]);


  public commanders = computed(() => {
    return _.chain(this.statsService.commanders()).values()
      .filter(c => c.commander.indexOf(this.filter) >= 0)
      .filter(c => this.bracketFilter().includes(c.bracket)
      )
      .value();
  }
  );


}





