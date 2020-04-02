import { NgModule } from '@angular/core';
import { ActionReducer, combineReducers, StoreModule } from '@ngrx/store';
import * as fromQuote from './quote.reducer';
import * as fromAuth from './auth.reducer';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { storeFreeze } from 'ngrx-store-freeze';
import { compose } from '@ngrx/core/compose';
import { environment } from '../../environments/environment';
import { RouterModule } from '@angular/router';
import { createSelector } from 'reselect';
import { Auth } from '../services/auth.model';

export interface State {
  quote: fromQuote.State;
  auth: Auth;
}

const initialState: State = {
  quote: fromQuote.initialState,
  auth: fromAuth.initialState,
};

const reducers = {
  quote: fromQuote.reducer,
  auth: fromAuth.reducer,
};

const productionReducers: ActionReducer<State> = combineReducers(reducers);
const developmentReducers: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers);

export function reducer(state = initialState, action: any ): State {
  return environment.production ? productionReducers(state, action) : developmentReducers(state, action);
}

export const getQuoteState = (state: State) => state.quote;
export const getAuthState = (state: State) => state.auth;

export const getQuote = createSelector(getQuoteState, fromQuote.getQuote);

@NgModule({
  imports: [
    StoreModule.forRoot(reducers),
    // EffectsModule.forRoot([]),
    RouterModule.forRoot([

    ]),
    StoreRouterConnectingModule.forRoot(),
    // !environment.production ? StoreDevtoolsModule.instrument({maxAge: 50}) : []
  ]
})
export class AppStoreModule {

}
