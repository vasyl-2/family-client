import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateUserComponent implements OnInit {


  user!: FormGroup;

  constructor(
    private fB: FormBuilder,
    public dialogRef: MatDialogRef<CreateUserComponent>
  ) {
  }
  get roleControl(): FormControl {
    return this.user.get('role') as FormControl;
  };

  get emailControl(): FormControl {
    return this.user.get('email') as FormControl;
  };

  ngOnInit(): void {
    this.initForm();
  }

  close(): void {
    this.dialogRef.close();
  }


  private initForm(): void {
    this.user = this.fB.group({
      email: '',
      role: ''
    })
  }
}
