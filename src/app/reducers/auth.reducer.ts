import * as actions from '../actions/auth.action';
import { Auth } from '../services/auth.model';

export interface State {
  auth: Auth;
}

export const initialState: Auth = {

};

export function reducer(state = initialState, action: actions.Actions ): Auth {
  switch (action.type) {
    case actions.ActionTypes.LOGIN_SUCCESS:
    case actions.ActionTypes.REGISTER_SUCCESS: {
      return {...action.payload as Auth};
    }
    case actions.ActionTypes.LOGIN_FAIL:
    case actions.ActionTypes.REGISTER_FAIL: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}

export const getAuth = (state: State) => state.auth;
