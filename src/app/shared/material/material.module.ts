import { NgModule } from '@angular/core';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {MatLegacyRadioModule as MatRadioModule} from '@angular/material/legacy-radio';
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';



@NgModule({
  declarations: [],
  imports: [
    MatSlideToggleModule,
    MatTabsModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatRadioModule,
    MatTableModule,
    MatTooltipModule,
    MatInputModule,
    MatDatepickerModule,
    MatToolbarModule,
    MatIconModule,

  ],
  exports: [
    MatSlideToggleModule,
    MatTabsModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatRadioModule,
    MatTableModule,
    MatTooltipModule,
    MatInputModule,
    MatDatepickerModule,
    MatToolbarModule,
    MatIconModule,
  ]
})
export class MaterialModule { }
