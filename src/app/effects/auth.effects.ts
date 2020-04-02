import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as actions from '../actions/auth.action';
import * as RouterActions from '../actions/router.action';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { User } from '../domain';

const toPayload = <T>(action: {payload: T}) => action.payload;

@Injectable()
export class AuthEffects {

  @Effect()
  login$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.LOGIN),
    map(toPayload),
    switchMap(({email, password}) => this.service$.login(email, password)
      .pipe(
        map(q => new actions.LoginSuccessAction(q)),
        catchError(err => of(new actions.LoginFailAction(JSON.stringify(err))))
      )
    )
  );

  @Effect()
  register$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.REGISTER),
    map(toPayload),
    switchMap((user: User) => this.service$.register(user)
      .pipe(
        map(q => new actions.RegisterSuccessAction(q)),
        catchError(err => of(new actions.RegisterFailAction(JSON.stringify(err))))
      )
    )
  );

  @Effect()
  logout$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.LOGOUT),
    map(out => new RouterActions.Go({path: ['/']}))
  );

  @Effect()
  loginAndNavigate$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.LOGIN_SUCCESS),
    map(out => new RouterActions.Go({path: ['/projects']}))
  );

  @Effect()
  registerAndNavigate: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.LOGIN_SUCCESS),
    map(out => new RouterActions.Go({path: ['/projects']}))
  );

  constructor(private actions$: Actions, private service$: AuthService) {

  }
}
