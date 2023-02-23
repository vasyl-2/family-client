import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {chapters} from "../../../data/chapters";

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntryComponent implements OnInit {

  public chaptersA = chapters;

  constructor() { }

  ngOnInit(): void {
  }

}
