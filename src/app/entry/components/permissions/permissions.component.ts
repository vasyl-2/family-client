import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Permission } from '../../../models/permission';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-permissions',
    templateUrl: './permissions.component.html',
    styleUrls: ['./permissions.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class PermissionsComponent {
  @Input() permissions!: Permission[] | null | undefined;
}
