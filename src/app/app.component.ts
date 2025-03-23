import {Component, OnInit} from '@angular/core';
import {filter} from "rxjs/operators";
import {Router} from "@angular/router";
import {select, Store} from "@ngrx/store";

import {isAuthenticated} from "./store/selectors";
import {GalleryState} from "./store/reducer";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private store: Store<GalleryState>,
  ) {
  }

  title = 'family-client';

  ngOnInit(): void {
    this.store.pipe(select(isAuthenticated))
      .pipe(filter(Boolean))
      .subscribe((_) => { console.log('AUTH_!!!!!!!!!!!'); this.router.navigate(['/']); });
  }
}
