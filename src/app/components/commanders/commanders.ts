import { Component, computed, inject } from '@angular/core';
import { StatsService } from 'app/services/stats.service';
import { TableModule } from "primeng/table";
import _ from 'lodash';
import { AvatarModule } from "primeng/avatar";
import { FormsModule } from '@angular/forms';
import { ConfigService } from 'app/services/config.service';
import { CardModule } from "primeng/card";
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

import { CommanderCard } from "../commander-card/commander-card";



@Component({
  selector: 'app-commanders',
  imports: [TableModule, AvatarModule, FormsModule, CardModule, InputTextModule, TagModule, CommanderCard],
  templateUrl: './commanders.html',
  styleUrl: './commanders.css',
})
export class Commanders {

  public filter = '';

  public statsService = inject(StatsService);
  public config = inject(ConfigService).config;


  public commanders = computed(() => {
    return _.chain(this.statsService.commanders()).values().filter(c => c.commander.indexOf(this.filter) >= 0).value();
  }
  );


}





