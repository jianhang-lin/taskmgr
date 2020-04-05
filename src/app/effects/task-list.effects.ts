import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import * as actions from '../actions/task-list.action';
import * as RouterActions from '../actions/router.action';
import * as fromRoot from '../reducers';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TaskListService } from '../services/task-list.service';
import { debug } from '../utils/debug.util';
import {TaskListModel} from '../domain';

const toPayload = <T>(action: {payload: T}) => action.payload;

@Injectable()
export class TaskListEffects {

  @Effect()
  loadTaskLists$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.LOAD),
    map(toPayload),
    switchMap((projectId: string) => this.service$.get(projectId)
      .pipe(
        map(taskLists => new actions.LoadSuccessAction(taskLists)),
        catchError(err => of(new actions.LoadFailAction(JSON.stringify(err))))
      )
    )
  );

  @Effect()
  addTaskList$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.ADD),
    map(toPayload),
    debug('add'),
    switchMap((taskList) => {
      return this.service$.add(taskList as TaskListModel).pipe(
        map(tl => new actions.AddSuccessAction(tl)),
        catchError(err => of(new actions.AddFailAction(JSON.stringify(err)))));
    })
  );

  @Effect()
  updateTaskLists$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.UPDATE),
    map(toPayload),
    switchMap((taskList: TaskListModel) => this.service$.update(taskList)
      .pipe(
        map(tl => new actions.UpdateSuccessAction(tl)),
        catchError(err => of(new actions.UpdateFailAction(JSON.stringify(err))))
      )
    )
  );

  @Effect()
    // @ts-ignore
  delTaskList$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.DELETE),
    map(toPayload),
    // @ts-ignore
    switchMap((taskList) => this.service$.del(taskList)
      .pipe(
        // @ts-ignore
        map(tl => new actions.DeleteSuccessAction(tl)),
        catchError(err => of(new actions.DeleteFailAction(JSON.stringify(err))))
      )
    )
  );

  @Effect()
  swap$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.SWAP),
    map(toPayload),
    switchMap(({src, target}) => this.service$.swapOrder(src, target).pipe(
      map(taskLists => new actions.SwapSuccessAction(taskLists)),
      catchError(err => of(new actions.SwapFailAction(JSON.stringify(err))))
    ))
  );

  constructor(
    private actions$: Actions,
    private store$: Store<fromRoot.State>,
    private service$: TaskListService) {

  }
}
