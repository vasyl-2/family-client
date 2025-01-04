import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-permission-edit',
  templateUrl: './permission-edit.component.html',
  styleUrls: ['./permission-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionEditComponent {}
