import {ChangeDetectionStrategy, Component, output, signal} from '@angular/core';
import {MatButtonToggleChange} from "@angular/material/button-toggle";

@Component({
  selector: 'app-view-settings',
  templateUrl: './view-settings.component.html',
  styleUrl: './view-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class ViewSettingsComponent {

  order = output<'asc' | 'desc' | 'random'>();
  view = output<'table' | 'little' | 'big'>()
  readonly panelOpenState = signal(0);

  onChange(e: MatButtonToggleChange): void {
    const { value: order } = e;
    this.order.emit(order);
  }

  onViewChange(e: MatButtonToggleChange): void {
    const { value: view } = e;
    this.view.emit(view);
  }
}
