import {ChangeDetectionStrategy, Component, OnInit, signal} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {MatButtonToggleChange} from "@angular/material/button-toggle";

@Component({
  selector: 'app-view-settings',
  templateUrl: './view-settings.component.html',
  styleUrl: './view-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class ViewSettingsComponent implements OnInit {

  sortOrderDict = {
    desc: 'по-возрастанию',
    asc: 'по-убыванию',
    random: 'перемешать'
  }

  readonly panelOpenState = signal(false);

  constructor(
    // private translate: TranslateService
  ) {
    // this.translate.setDefaultLang('base');
  }

  ngOnInit(): void {
  }

  onChange(e: MatButtonToggleChange) {
    const { value: order } = e;
    console.log('CHANGE_SORT____', order);

  }

}
