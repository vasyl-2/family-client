import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef, Type, TemplateRef,
} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { CreatePhotoComponent } from '../../shared/components/create-photo/create-photo.component';
import { GalleryState } from '../../store/reducer';
import { Chapter } from '../../models/chapter';
import {
  authenticateAlert,
  createChapter,
  createPhoto,
  logout,
} from '../../store/action';
import { PhotoMedia } from '../../models/photo';
import {
  alertSelector,
  chaptersHierarchySelector,
  chaptersSelector,
  isAuthenticated,
  permissionsForUserLoaded,
} from '../../store/selectors';
import { CreateChapterComponent } from '../../shared/components/create-chapter/create-chapter.component';
import { CreateChapter } from '../../models/dto/create-chapter';
import { CreateVideoComponent } from '../../shared/components/create-video/create-video.component';
import { CheckTokenService } from '../../services/authorization/check-token.service';
import { EditChaptersComponent } from '../../shared/components/edit-chapters/edit-chapters.component';
import { NgxPermissionsService } from 'ngx-permissions';
import {TranslateService} from "@ngx-translate/core";
import {CreateDocComponent} from "../../shared/components/create-doc/create-doc.component";

@Component({
  selector: 'app-header-top',
  templateUrl: './header-top.component.html',
  styleUrls: ['./header-top.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class HeaderTopComponent implements OnInit, OnDestroy {
  imageUrl!: string;
  showAlert$!: Observable<boolean>;
  isLoggedIn$!: Observable<boolean>;

  private sub = new Subscription();

  constructor(
    private dialog: MatDialog,
    private store: Store<GalleryState>,
    private router: Router,
    public checkTokenService: CheckTokenService,
    private cdr: ChangeDetectorRef,
    private ngxPermissionsService: NgxPermissionsService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.checkTokenService.checkToken();
    // this.ngxPermissionsService.getPermissions()

    this.store.pipe(select(permissionsForUserLoaded)).subscribe((x) => {
      this.cdr.detectChanges();
    });

    this.setSubs();

    this.isLoggedIn$.pipe(filter(Boolean)).subscribe((_) => {
      this.checkTokenService.checkToken(); // !!!!!! CHECK !!!!!!!!!! ****** TODO
      // this.router.navigate(['/']).then(() => {
      //   location.reload();
      // });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  setType() {
    return {
      photo: CreatePhotoComponent,
      video: CreateVideoComponent,
      pdf: CreateDocComponent
    } as const;
  }

  addMedia(mediaType: 'photo' | 'video' | 'pdf'): void {
    this.checkToken();

    // const components = this.setType();
    // type MediaMap = typeof components;
    // type MediaType = keyof MediaMap;
    // type ComponentClass<K extends MediaType> = MediaMap[K];
    // type ComponentInstance<K extends MediaType> = ComponentClass<K> extends new (...args: any[]) => infer R ? R : never;

    // let dialogRef: MatDialogRef<ComponentInstance<'photo'>>;

    const data = { panelClass: 'dialog-property', data: {} };

    // @TODO refactor
    switch (mediaType) {
      case 'photo':
        const dialogRefPhoto = this.openCreateComponent(CreatePhotoComponent, data);
        this.subscribeToCreateCLose(dialogRefPhoto);
        break;
      case 'video':
        const dialogRefVideo = this.openCreateComponent(CreateVideoComponent, data);
        this.subscribeToCreateCLose(dialogRefVideo);
        break;
      case 'pdf':
        const dialogRefPdf = this.openCreateComponent(CreateDocComponent, data);
        this.subscribeToCreateCLose(dialogRefPdf);
        break;
      default:
        this.assertCannotReach(mediaType);
    }
  }

  private assertCannotReach(type: never) {
    throw new Error('can not reach anything!');
  }

  private openCreateComponent<T>(comp: Type<T>, data: Record<string, any>): MatDialogRef<T> {
    return this.dialog.open<T>(comp, data);
  }

  private subscribeToCreateCLose<T>(dialogRef: MatDialogRef<T>): void {
    this.sub.add(
      dialogRef
        .afterClosed()
        .pipe(
          filter((media: PhotoMedia) => !!media),
          switchMap((media) =>
            this.store.pipe(select(chaptersSelector)).pipe(
              map((chapters: Chapter[]) => {
                const currentChapter = chapters.find(
                  (c: Chapter) => c._id === media.chapter,
                );
                media.chapterName = currentChapter!!.title;
                return media;
              }),
            ),
          ),
        )
        .subscribe((media: PhotoMedia) =>
          this.store.dispatch(createPhoto({ payload: media })),
        ),
    );
  }

  private checkToken() {
    if (!this.checkTokenService.isAdminSubject.value) {
      return;
    }
  }


  editChapters(): void {
    this.dialog.open(EditChaptersComponent);
  }

  setLang(lang: 'uk' | 'de' | 'es' | 'en'): void {
    this.translate.setDefaultLang(lang);
  }

  addChapter(): void {
    if (!this.checkTokenService.isAdminSubject.value) {
      return;
    }

    const selector = chaptersHierarchySelector;

    this.sub.add(
      this.dialog.open(CreateChapterComponent).afterClosed()
        .pipe(
          filter((chapter: CreateChapter | undefined) => !!chapter),
          switchMap((chapter: CreateChapter | undefined) =>
            this.store.pipe(select(selector)).pipe(
              map((chapters: Chapter[]) => {
                const newChapter: CreateChapter = { ...chapter };

                let fullPath: string;
                if (newChapter.parent) {
                  const parentPath = this.buildFullPath(
                    chapters,
                    newChapter.parent,
                  );
                  fullPath = `${parentPath}/${newChapter.nameForUI}`;
                } else {
                  fullPath = newChapter.nameForUI!;
                }

                newChapter.fullPath = fullPath;

                return newChapter;
              }),
            ),
          ),
          // switchMap((chapter: CreateChapter | undefined) => this.store.pipe(select(chaptersSelector))
          //   .pipe(map((chapters: Chapter[]) => {
          //     const newChapter = { ...chapter };
          //     const currentChapter = chapters.find((c: Chapter) => c._id === chapter!.parent);
          //     newChapter!.parentTitle = currentChapter!.title;
          //     return newChapter;
          //   }))),
        )
        .subscribe((chapter: Chapter | undefined) => {
          chapter && this.store.dispatch(createChapter({ payload: chapter }));
        }),
    );
  }

  buildFullPath(list: Chapter[], nearestParentId: string) {
    function findPath(item: Chapter): string | null {
      if (item._id === nearestParentId) {
        return item.title!;
      }

      if (item.children && item.children.length) {
        for (const child of item.children) {
          const pathInChild = findPath(child);
          if (pathInChild) {
            return item.title + '/' + pathInChild;
          }
        }
      }

      return null;
    }

    for (const item of list) {
      const path = findPath(item);
      if (path) {
        return path;
      }
    }

    return null; // Return null if the item with the given id is not found
  }

  logout(): void {
    localStorage.removeItem('auth');
    this.store.dispatch(authenticateAlert());
    this.store.dispatch(logout());
    this.router.navigate(['/auth', 'logout']);
  }

  private setSubs(): void {
    this.showAlert$ = this.store.pipe(select(alertSelector));
    this.isLoggedIn$ = this.store.pipe(select(isAuthenticated));
  }
}
