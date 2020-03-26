import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-task-header',
  templateUrl: './task-header.component.html',
  styleUrls: ['./task-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskHeaderComponent implements OnInit {

  @Input() header = '';
  @Output() newTask = new EventEmitter<void>();
  @Output() moveAll = new EventEmitter<void>();
  @Output() delList = new EventEmitter<void>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onEditList = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  onNewTaskClick() {
    this.newTask.emit();
  }

  onMoveAllClick() {
    this.moveAll.emit();
  }

  onDelListClick() {
    this.delList.emit();
  }

  onEditListClick() {
    this.onEditList.emit();
  }
}
