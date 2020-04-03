import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import * as actions from '../actions/project.action';
import * as RouterActions from '../actions/router.action';
import * as fromRoot from '../reducers';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { ProjectService } from '../services/project.service';

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
    withLatestFrom(this.store$.select(fromRoot.getAuthState)),
    switchMap(([project, auth]) => {
        // @ts-ignore
      const added = {...project, members: [`${auth.userId}`]};
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
    // @ts-ignore
    map(project => new RouterActions.Go({path: [`/projects/${project.id}`]}))
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

  constructor(
    private actions$: Actions,
    private store$: Store<fromRoot.State>,
    private service$: ProjectService) {

  }
}
