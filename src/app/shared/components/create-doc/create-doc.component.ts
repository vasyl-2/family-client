import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {Chapter} from "../../../models/chapter";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {select, Store} from "@ngrx/store";
import {GalleryState} from "../../../store/reducer";
import {chaptersHierarchySelector} from "../../../store/selectors";

@Component({
  selector: 'app-create-doc',
  templateUrl: './create-doc.component.html',
  styleUrl: './create-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class CreateDocComponent implements OnInit {

  addDocForm!: FormGroup;
  docChapters$!: Observable<Chapter[]>;
  today!: Date;

  private readonly sub = new Subscription();
  private readonly fileSubject = new BehaviorSubject<File | undefined>(
    undefined,
  );

  get chapterControl(): FormControl {
    return this.addDocForm!.get('chapter') as FormControl;
  }

  constructor(
    private fromBuilder: FormBuilder,
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<{ gallery: GalleryState }>,
  ) {}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.initForm();
    this.today = new Date(new Date().getTime());

    this.docChapters$ = this.store.pipe(select(chaptersHierarchySelector));
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private initForm(): void {
    this.addDocForm = this.fromBuilder.group({
      name: ['', Validators.required],
      chapter: '',
      description: '',
      fullPath: '',
      dateOfDoc: '',
    });
  }

}
