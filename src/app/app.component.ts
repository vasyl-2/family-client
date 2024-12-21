import {Component} from '@angular/core';
import {GalleryState} from "./store/reducer";
import {Store} from "@ngrx/store";

import {receiveChapters, receiveVideoChapters} from "./store/action";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'family-client';

  constructor(private store: Store<GalleryState>) {
    this.store.dispatch(receiveChapters());
    this.store.dispatch(receiveVideoChapters());
  }
}
