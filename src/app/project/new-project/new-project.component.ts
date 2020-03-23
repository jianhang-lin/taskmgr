import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data, private dialogRef: MatDialogRef<NewProjectComponent>) { }

  ngOnInit(): void {
    console.log(JSON.stringify(this.data));
  }

  onClick() {
    this.dialogRef.close('I received your message');
  }
}
