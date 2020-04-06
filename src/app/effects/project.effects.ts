import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { from, Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import * as actions from '../actions/project.action';
import * as RouterActions from '../actions/router.action';
import * as fromRoot from '../reducers';
import * as listActions from '../actions/task-list.action';
import * as userActions from '../actions/user.action';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { ProjectService } from '../services/project.service';
import { ProjectModel } from '../domain';
import { debug } from '../utils/debug.util';
import { Auth } from '../services/auth.model';

const toPayload = <T>(action: {payload: T}) => action.payload;

@Injectable()
export class ProjectEffects {

  @Effect()
  loadProjects$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.LOAD),
    map(toPayload),
    withLatestFrom(this.store$.select(fromRoot.getAuthState)),
    switchMap(([_, auth]) => {
      return this.service$.get(auth.user.id)
        .pipe(
          map(projects => new actions.LoadSuccessAction(projects)),
          catchError(err => of(new actions.LoadFailAction(JSON.stringify(err))))
        );
      }
    )
  );

  @Effect()
  addProject$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.ADD),
    map(toPayload),
    debug('add'),
    withLatestFrom(this.store$.select(fromRoot.getAuthState).pipe(map((auth: Auth) => auth.user)), debug('auth')),
    switchMap(([project, user]) => {
      const added = {...project, members: [`${user.id}`]};
      return this.service$.add(added).pipe(
        map(p => new actions.AddSuccessAction(p)),
          catchError(err => of(new actions.AddFailAction(JSON.stringify(err)))));
      }
    )
  );

  @Effect()
  // @ts-ignore
  updateProjects$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.UPDATE),
    map(toPayload),
    // @ts-ignore
    switchMap((p) => this.service$.update(p)
      .pipe(
        // @ts-ignore
        map(projects => new actions.UpdateSuccessAction(projects)),
        catchError(err => of(new actions.UpdateFailAction(JSON.stringify(err))))
      )
    )
  );

  @Effect()
  // @ts-ignore
  delProjects$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.DELETE),
    map(toPayload),
    // @ts-ignore
    switchMap((p) => this.service$.del(p)
      .pipe(
        // @ts-ignore
        map(projects => new actions.DeleteSuccessAction(projects)),
        catchError(err => of(new actions.DeleteFailAction(JSON.stringify(err))))
      )
    )
  );

  @Effect()
  selectProjects$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.SELECT_PROJECT),
    map(toPayload),
    map((project: ProjectModel) => new RouterActions.Go({path: [`/tasklists/${project.id}`]}))
  );

  @Effect()
  loadTaskLists: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.SELECT_PROJECT),
    map(toPayload),
    map((project: ProjectModel) => new listActions.LoadAction(project.id))
  );

  @Effect()
  invitProjects$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.INVITE),
    map(toPayload),
    // @ts-ignore
    switchMap(({projectId, members}) => this.service$.invite(projectId, members)
      .pipe(
        // @ts-ignore
        map(projects => new actions.InviteSuccessAction(projects)),
        catchError(err => of(new actions.InviteFailAction(JSON.stringify(err))))
      )
    )
  );

  @Effect()
  loadUsers$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.LOAD_SUCCESS),
    map(toPayload),
    switchMap((projects: ProjectModel[]) => from(projects.map(prj => prj.id)).pipe(
      map(projectId => new userActions.LoadAction(projectId))
    ))
  );

  @Effect()
  addUserProject$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.ADD_SUCCESS),
    map(toPayload),
    map((project: ProjectModel) => project.id),
    withLatestFrom(this.store$.select(fromRoot.getAuthState).pipe(map(auth => auth.user)), (projectId, user) => {
      return new userActions.AddAction({user, projectId});
    })
  );

  @Effect()
  removeUserProject$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.DELETE_SUCCESS),
    map(toPayload),
    map((project: ProjectModel) => project.id),
    withLatestFrom(this.store$.select(fromRoot.getAuthState).pipe(map(auth => auth.user)), (projectId, user) => {
      return new userActions.DeleteAction({user, projectId});
    })
  );

  @Effect()
  updateUserProject$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.INVITE_SUCCESS),
    map(toPayload),
    map((project: ProjectModel) => new userActions.UpdateAction(project))
  );

  constructor(
    private actions$: Actions,
    private store$: Store<fromRoot.State>,
    private service$: ProjectService) {

  }
}
