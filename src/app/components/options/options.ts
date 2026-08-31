import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfigService } from 'app/services/config.service';
import { SettingsService } from 'app/settings.service';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Card, CardModule } from "primeng/card";
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonDirective } from 'primeng/button';
@Component({
  selector: 'app-options',
  imports: [RadioButtonModule, FormsModule, SelectButtonModule, CardModule, IftaLabelModule, InputTextModule, ButtonDirective],
  templateUrl: './options.html',
  styleUrl: './options.css',
})
export class Options {

  public settings = inject(SettingsService);
  public config = inject(ConfigService).config;


}
