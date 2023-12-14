import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Observable, Subscription} from "rxjs";
import {select, Store} from "@ngrx/store";

import {GalleryState} from "../../../store/reducer";
import {receivePhotos} from "../../../store/action";
import {photosSelector} from "../../../store/selectors";
import {Photo} from "../../../models/photo";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-photos-list',
  templateUrl: './photos-list.component.html',
  styleUrls: ['./photos-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotosListComponent implements OnInit, OnDestroy{


  photos$!: Observable<Photo[] | undefined>;
  private sub = new Subscription();
  constructor(
    private route: ActivatedRoute,
    private store: Store<GalleryState>,
  ) {
  }

  ngOnInit(): void {
    this.subscribeToRoute();
    this.photos$ = this.store.pipe(select(photosSelector));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getAsset(photo: Photo): string {
    const { fullPath, name } = photo;
    let path =  fullPath ? `${fullPath}/${name}` : name;
    path = `${environment.apiUrl}/${path}`;

    return path;
  }

  private subscribeToRoute(): void {
    this.sub.add(
      this.route.paramMap.subscribe((p: ParamMap) => {
        this.store.dispatch(receivePhotos({ chapter: p.get('chapter')! }));
      })
    )
  }

}
