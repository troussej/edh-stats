import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { computed } from '@angular/core';
import { ConfigService } from 'app/services/config.service';
import { SettingsService } from 'app/services/settings.service';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Card, CardModule } from "primeng/card";
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonDirective } from 'primeng/button';
import { StatsService } from 'app/services/stats.service';
import _ from 'lodash';
@Component({
  selector: 'app-options',
  imports: [RadioButtonModule, FormsModule, SelectButtonModule, CardModule, IftaLabelModule, InputTextModule, ButtonDirective, SelectModule],
  templateUrl: './options.html',
  styleUrl: './options.css',
})
export class Options {

  public settings = inject(SettingsService);
  public config = inject(ConfigService).config;
  public statsService = inject(StatsService);


  public lieux = computed(() => {
    return _.chain(this.statsService.games())
      .map(g => g.lieu)
      .uniq()
      .value();
  });
}
