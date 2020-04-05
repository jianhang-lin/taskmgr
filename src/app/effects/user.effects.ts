import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import * as actions from '../actions/user.action';
import * as RouterActions from '../actions/router.action';
import * as fromRoot from '../reducers';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { debug } from '../utils/debug.util';
import { ProjectModel, User } from '../domain';

const toPayload = <T>(action: {payload: T}) => action.payload;

@Injectable()
export class UserEffects {

  @Effect()
  loadUsers$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.LOAD),
    map(toPayload),
    switchMap((projectId: string) => this.service$.getUsersByProject(projectId)
      .pipe(
        map(users => new actions.LoadSuccessAction(users)),
        catchError(err => of(new actions.LoadFailAction(JSON.stringify(err))))
      )
    )
  );

  @Effect()
  addUserProjectRef$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.ADD),
    map(toPayload),
    debug('add'),
    switchMap(({user, projectId}) => {
      return this.service$.addProjectRef(user, projectId).pipe(
        map((u: User) => new actions.AddSuccessAction(u)),
        catchError(err => of(new actions.AddFailAction(JSON.stringify(err)))));
    })
  );

  @Effect()
  updateUserProjectRef$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.UPDATE),
    map(toPayload),
    switchMap((project: ProjectModel) => this.service$.batchUpdateProjectRef(project)
      .pipe(
        map(users => new actions.UpdateSuccessAction(users)),
        catchError(err => of(new actions.UpdateFailAction(JSON.stringify(err))))
      )
    )
  );

  @Effect()
  delUserProjectRef$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.DELETE),
    map(toPayload),
    switchMap(({user, projectId}) => this.service$.removeProjectRef(user, projectId)
      .pipe(
        map(u => new actions.DeleteSuccessAction(u)),
        catchError(err => of(new actions.DeleteFailAction(JSON.stringify(err))))
      )
    )
  );

  @Effect()
  search$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.SEARCH),
    map(toPayload),
    switchMap((str: string) => this.service$.searchUsers(str).pipe(
      map(users => new actions.SearchSuccessAction(users)),
      catchError(err => of(new actions.SearchFailAction(JSON.stringify(err))))
    ))
  );

  constructor(
    private actions$: Actions,
    private store$: Store<fromRoot.State>,
    private service$: UserService) {

  }
}
