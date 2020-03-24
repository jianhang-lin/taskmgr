import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  title = '';
  priorities = [
    {
      label: '紧急',
      value: 1
    },
    {
      label: '重要',
      value: 2
    },
    {
      label: '普通',
      value: 3
    }
  ];

  constructor(@Inject(MAT_DIALOG_DATA) private data) { }

  ngOnInit(): void {
    this.title = this.data.title;
    console.log(JSON.stringify(this.data.task));
  }

  onClick() {

  }
}
