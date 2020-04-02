import { Action } from '@ngrx/store';
import { QuoteModel } from '../domain';
import { type } from '../utils/type.util';

export const ActionTypes = {
  LOAD: type('[Quote] Load'),
  LOAD_SUCCESS: type('[Quote] Load Success'),
  LOAD_FAIL: type('[Quote] Load Fail'),
};

export class LoadAction implements Action {
  type = ActionTypes.LOAD;

  constructor(public payload: null) {
  }
}

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;

  constructor(public payload: QuoteModel) {
  }
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;

  constructor(public payload: string) {
  }
}

export type Actions = LoadAction | LoadSuccessAction | LoadFailAction;

