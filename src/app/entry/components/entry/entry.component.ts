import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {Observable} from "rxjs";
import {select, Store} from "@ngrx/store";

import {getUsers, createUser, editUser } from "../../../store/action";
import {GalleryState} from "../../../store/reducer";
import {usersSelector} from "../../../store/selectors";
import {User} from "../../../models/user";

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntryComponent implements OnInit {


  users$!: Observable<any>;
  roles$!: Observable<any>;

  constructor(private store: Store<GalleryState>) { }

  ngOnInit(): void {
    this.users$ = this.store.pipe(
      select(usersSelector),
    );

    this.store.dispatch(getUsers());
  }

  onUpdate(user: User): void {
    console.log('UPDATED___USER____', user);
    this.store.dispatch(editUser({ user }));
  }

  createUser(user: User): void {
    console.log('CREATE___USER____', user);
    this.store.dispatch(createUser({ user }));
  }

}
