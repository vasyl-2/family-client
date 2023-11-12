import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject, Observable} from "rxjs";
import {Chapter} from "../../../models/chapter";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {select, Store} from "@ngrx/store";
import {GalleryState} from "../../../store/reducer";
import {chaptersHierarchySelector, chaptersSelector} from "../../../store/selectors";
import {CreateChapter} from "../../../models/dto/create-chapter";

@Component({
  selector: 'app-create-chapter',
  templateUrl: './create-chapter.component.html',
  styleUrls: ['./create-chapter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateChapterComponent {
  addChapterForm!: FormGroup;

  private readonly fileSubject = new BehaviorSubject<File | undefined>(undefined);

  photoChapters$!: Observable<Chapter[]>;

  constructor(
    private fromBuilder: FormBuilder,
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<{ gallery: GalleryState}>
  ) {
  }

  ngOnInit() {
    this.initForm();

    this.photoChapters$ = this.store.pipe(
      select(chaptersHierarchySelector),
    )
  }

  addChapter(): void {
    const { name = undefined, parentChapter = undefined, latinname = undefined } = this.addChapterForm.value;
    const chapter: CreateChapter = { title: latinname, nameForUI: name, parent: parentChapter };

    console.log('RES_____', chapter);
    this.dialogRef.close(chapter);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private initForm(): void {
    this.addChapterForm = this.fromBuilder.group({
      name: ['', Validators.required],
      latinname: ['', Validators.required],
      parentChapter: '',
    })
  }
}
