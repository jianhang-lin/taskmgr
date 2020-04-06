import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-copy-task',
  templateUrl: './copy-task.component.html',
  styleUrls: ['./copy-task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CopyTaskComponent implements OnInit {

  lists: any[];
  form: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CopyTaskComponent>) { }

  ngOnInit(): void {
    this.lists = this.data.lists;
    this.form = this.fb.group({
      targetListId: []
    });
  }

  onSubmit(en: Event, {value, valid}) {
    en.preventDefault();
    if (!valid) {
      return;
    }
    this.dialogRef.close(value.targetListId);
  }
}
