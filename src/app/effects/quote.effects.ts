import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as actions from '../actions/quote.action';
import { catchError, map, switchMap } from 'rxjs/operators';
import { QuoteService } from '../services/quote.service';

const toPayload = <T>(action: {payload: T}) => action.payload;

@Injectable()
export class QuoteEffects {

  @Effect()
  quote$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.LOAD),
    map(toPayload),
    switchMap(a => this.service$.getQuote()
      .pipe(
        map(q => new actions.LoadSuccessAction(q)),
        catchError(err => of(new actions.LoadFailAction(JSON.stringify(err))))
      )
    )
  );
  constructor(private actions$: Actions, private service$: QuoteService) {

  }
}
