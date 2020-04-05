import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import * as actions from '../actions/task.action';
import * as RouterActions from '../actions/router.action';
import * as fromRoot from '../reducers';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TaskService } from '../services/task.service';
import { debug } from '../utils/debug.util';
import {TaskListModel, TaskModel} from '../domain';

const toPayload = <T>(action: {payload: T}) => action.payload;

@Injectable()
export class TaskEffects {

  @Effect()
  loadTasks$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.LOAD),
    map(toPayload),
    switchMap((taskLists: TaskListModel[]) => this.service$.getByLists(taskLists)
      .pipe(
        map((tasks: TaskModel[]) => new actions.LoadSuccessAction(tasks)),
        catchError(err => of(new actions.LoadFailAction(JSON.stringify(err))))
      )
    )
  );

  @Effect()
  addTask$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.ADD),
    map(toPayload),
    switchMap((task: TaskModel) => {
      return this.service$.add(task).pipe(
        map((t: TaskModel) => new actions.AddSuccessAction(t)),
        catchError(err => of(new actions.AddFailAction(JSON.stringify(err)))));
    })
  );

  @Effect()
  updateTasks$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.UPDATE),
    map(toPayload),
    switchMap((task: TaskModel) => this.service$.update(task)
      .pipe(
        map((t: TaskModel) => new actions.UpdateSuccessAction(t)),
        catchError(err => of(new actions.UpdateFailAction(JSON.stringify(err))))
      )
    )
  );

  @Effect()
  delTask$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.DELETE),
    map(toPayload),
    switchMap((task: TaskModel) => this.service$.del(task)
      .pipe(
        map((t: TaskModel) => new actions.DeleteSuccessAction(t)),
        catchError(err => of(new actions.DeleteFailAction(JSON.stringify(err))))
      )
    )
  );

  @Effect()
  complete$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.COMPLETE),
    map(toPayload),
    switchMap((task: TaskModel) => this.service$.complete(task)
      .pipe(
        map((t: TaskModel) => new actions.CompleteSuccessAction(t)),
        catchError(err => of(new actions.CompleteFailAction(JSON.stringify(err))))
      )
    )
  );

  @Effect()
  move$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.MOVE),
    map(toPayload),
    switchMap(({taskId, taskListId}) => this.service$.move(taskId, taskListId).pipe(
      map(task => new actions.MoveSuccessAction(task)),
      catchError(err => of(new actions.MoveFailAction(JSON.stringify(err))))
    ))
  );

  @Effect()
  moveAll$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.MOVE_ALL),
    map(toPayload),
    switchMap(({srcListId, targetListId}) => this.service$.moveAll(srcListId, targetListId).pipe(
      map(tasks => new actions.MoveAllSuccessAction(tasks)),
      catchError(err => of(new actions.MoveAllFailAction(JSON.stringify(err))))
    ))
  );

  constructor(
    private actions$: Actions,
    private store$: Store<fromRoot.State>,
    private service$: TaskService) {

  }
}
