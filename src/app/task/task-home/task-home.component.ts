import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewTaskComponent } from '../new-task/new-task.component';
import { CopyTaskComponent } from '../copy-task/copy-task.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { NewTaskListComponent } from '../new-task-list/new-task-list.component';
import { slideToRight } from '../../anim/router.anim';
import * as fromRoot from '../../reducers';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Observable, pipe } from 'rxjs';
import { filter, map, pluck, switchMap, take } from 'rxjs/operators';
import { TaskListModel } from '../../domain';
import * as actions from '../../actions/task-list.action';
import * as taskActions from '../../actions/task.action';

@Component({
  selector: 'app-task-home',
  templateUrl: './task-home.component.html',
  styleUrls: ['./task-home.component.scss'],
  animations: [
    slideToRight
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskHomeComponent implements OnInit {

  @HostBinding('@routeAnim') state;
  projectId$: Observable<string>;
  lists$: Observable<TaskListModel[]>;
  constructor(
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private store: Store<fromRoot.State>,
    private route: ActivatedRoute) {
    this.projectId$ = this.route.paramMap.pipe(pluck('id'));
    this.lists$ = this.store.select(fromRoot.getTasksByLists);
  }

  ngOnInit(): void {
  }


  launchNewTaskDialog(list) {
    const user$ = this.store.select(fromRoot.getAuthState).pipe(
      map(auth => auth.user)
    );
    user$.pipe(
      take(1),
      map(user => this.dialog.open(NewTaskComponent, {data: {title: '新建任务', owner: user}})),
      switchMap(dialogRef => dialogRef.afterClosed().pipe(
        take(1),
        filter(n => n)
      ))
    ).subscribe(val => this.store.dispatch(
      new taskActions.AddAction({...val, taskListId: list.id, completed: false, createDate: new Date()}))
    );
  }

  launchCopyTaskDialog(list: TaskListModel) {
    this.lists$.pipe(
      map(l => l.filter(n => n.id !== list.id)),
      map(li => this.dialog.open(CopyTaskComponent, {data: {lists: li}})),
      switchMap(dialogRef => dialogRef.afterClosed().pipe(
        take(1),
        filter(n => n)
      ))
     ).subscribe(val => this.store.dispatch(new taskActions.MoveAllAction({srcListId: list.id, targetListId: val})));
  }

  lauchUpdateTaskDialog(task) {
    const dialogRef = this.dialog.open(NewTaskComponent, {data: {title: '修改任务', task}});
    dialogRef.afterClosed()
      .pipe(
        take(1),
        filter(n => n)
      )
      .subscribe(val => this.store.dispatch(new taskActions.UpdateAction({...task, ...val})));
  }

  launchConfirmDialog(list: TaskListModel) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: {title: '删除任务列表：', content: '您确认删除该任务列表吗?'}});
    dialogRef.afterClosed()
      .pipe(
        take(1),
        filter(n => n)
        )
      .subscribe(result => this.store.dispatch(new actions.DeleteAction(list)));
  }

  launchEditListDialog(list: TaskListModel) {
    const dialogRef = this.dialog.open(NewTaskListComponent, {data: {title: '更改列表名称：', taskList: list}});
    dialogRef.afterClosed()
      .pipe(
        take(1)
      )
      .subscribe(result => this.store.dispatch(new actions.UpdateAction({...result, id: list.id})));
  }

  lauchNewListDialog(en: Event) {
    const dialogRef = this.dialog.open(NewTaskListComponent, {data: {title: '新建列表名称：'}});
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => this.store.dispatch(new actions.AddAction(result)));
  }

  handleMove(srcData, list) {
    switch (srcData.tag) {
      case 'task-item':
        console.log('handling item');
        break;
      case 'task-list':
        console.log('handling list');
        const srcList = srcData.data;
        const tempOrder = srcList.order;
        srcList.order = list.order;
        list.order = tempOrder;
        break;
      default:
        break;
    }
  }

  handleQuickTask(desc: string, list) {
    const user$ = this.store.select(fromRoot.getAuthState).pipe(
      map(auth => auth.user)
    );
    user$.pipe(
      take(1)
    ).subscribe(user => this.store.dispatch(
      new taskActions.AddAction({
        desc,
        priority: 3,
        taskListId: list.id,
        ownerId: user.id,
        completed: false,
        participantIds: [],
        createDate: new Date()
      }))
    );
  }
}
