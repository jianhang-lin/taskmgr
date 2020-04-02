import { NgModule } from '@angular/core';
import { ActionReducer, combineReducers, StoreModule } from '@ngrx/store';
import * as fromQuote from './quote.reducer';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { storeFreeze } from 'ngrx-store-freeze';
import { compose } from '@ngrx/core/compose';
import { environment } from '../../environments/environment';
import { RouterModule } from '@angular/router';

export interface State {
  quote: fromQuote.State;
}

const initialState: State = {
  quote: fromQuote.initialState,
};

const reducers = {
  quote: fromQuote.reducer,
};

const productionReducers: ActionReducer<State> = combineReducers(reducers);
const developmentReducers: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers);

export function reducer(state = initialState, action: any ): State {
  return environment.production ? productionReducers(state, action) : developmentReducers(state, action);
}


@NgModule({
  imports: [
    StoreModule.forRoot({
      store: reducer
    }),
    // EffectsModule.forRoot([]),
    RouterModule.forRoot([

    ]),
    StoreRouterConnectingModule.forRoot(),
    // !environment.production ? StoreDevtoolsModule.instrument({maxAge: 50}) : []
  ]
})
export class AppStoreModule {

}
