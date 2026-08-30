import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfigService } from 'app/services/config.service';
import { SettingsService } from 'app/settings.service';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-year-selector',
  imports: [RadioButtonModule, FormsModule],
  templateUrl: './year-selector.html',
  styleUrl: './year-selector.css',
})
export class YearSelector {

  public settings = inject(SettingsService);
  public config = inject(ConfigService).config;


}
