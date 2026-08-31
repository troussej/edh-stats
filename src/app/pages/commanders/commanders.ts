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
import { Options } from "app/components/options/options";
import { SettingsService } from 'app/settings.service';




@Component({
  selector: 'app-commanders',
  imports: [TableModule, AvatarModule, FormsModule, CardModule, InputTextModule, TagModule, CommanderCard, SelectButtonModule, Options],
  templateUrl: './commanders.html',
  styleUrl: './commanders.css',
})
export class Commanders {

  public statsService = inject(StatsService);
  public config = inject(ConfigService).config;
  public settings = inject(SettingsService);




  public commanders = computed(() => {
    return _.chain(this.statsService.commanders()).values()
      .filter(this.settings.filterCommanders())
      .value();
  }
  );


}





