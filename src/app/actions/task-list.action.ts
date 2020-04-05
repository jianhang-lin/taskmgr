import { Action } from '@ngrx/store';
import { type } from '../utils/type.util';
import { TaskListModel, User } from '../domain';

export const ActionTypes = {
  ADD: type('[TaskList] Add'),
  ADD_SUCCESS: type('[TaskList] Add Success'),
  ADD_FAIL: type('[TaskList] Add Fail'),
  UPDATE: type('[TaskList] Update'),
  UPDATE_SUCCESS: type('[TaskList] Update Success'),
  UPDATE_FAIL: type('[TaskList] Update Fail'),
  DELETE: type('[TaskList] Delete'),
  DELETE_SUCCESS: type('[TaskList] Delete Success'),
  DELETE_FAIL: type('[TaskList] Delete Fail'),
  LOAD: type('[TaskList] Load'),
  LOAD_SUCCESS: type('[TaskList] Load Success'),
  LOAD_FAIL: type('[TaskList] Load Fail'),
  SWAP: type('[TaskList] Swap'),
  SWAP_SUCCESS: type('[TaskList] Swap Success'),
  SWAP_FAIL: type('[TaskList] Swap Fail'),
};

export class AddAction implements Action {
  type = ActionTypes.ADD;

  constructor(public payload: TaskListModel) {
  }
}

export class AddSuccessAction implements Action {
  type = ActionTypes.ADD_SUCCESS;

  constructor(public payload: TaskListModel) {
  }
}

export class AddFailAction implements Action {
  type = ActionTypes.ADD_FAIL;

  constructor(public payload: string) {
  }
}

export class UpdateAction implements Action {
  type = ActionTypes.UPDATE;

  constructor(public payload: TaskListModel) {
  }
}

export class UpdateSuccessAction implements Action {
  type = ActionTypes.UPDATE_SUCCESS;

  constructor(public payload: TaskListModel) {
  }
}

export class UpdateFailAction implements Action {
  type = ActionTypes.UPDATE_FAIL;

  constructor(public payload: string) {
  }
}

export class DeleteAction implements Action {
  type = ActionTypes.DELETE;

  constructor(public payload: TaskListModel) {
  }
}

export class DeleteSuccessAction implements Action {
  type = ActionTypes.DELETE_SUCCESS;

  constructor(public payload: TaskListModel) {
  }
}

export class DeleteFailAction implements Action {
  type = ActionTypes.DELETE_FAIL;

  constructor(public payload: string) {
  }
}

export class LoadAction implements Action {
  type = ActionTypes.LOAD;

  constructor(public payload: string) {
  }
}

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;

  constructor(public payload: TaskListModel[]) {
  }
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;

  constructor(public payload: string) {
  }
}

export class SwapAction implements Action {
  type = ActionTypes.SWAP;

  constructor(public payload: {src: TaskListModel; target: TaskListModel}) {
  }
}

export class SwapSuccessAction implements Action {
  type = ActionTypes.SWAP_SUCCESS;

  constructor(public payload: TaskListModel[]) {
  }
}

export class SwapFailAction implements Action {
  type = ActionTypes.SWAP_FAIL;

  constructor(public payload: string) {
  }
}

export type Actions = AddAction | AddSuccessAction | AddFailAction |
  UpdateAction | UpdateSuccessAction | UpdateFailAction |
  DeleteAction | DeleteSuccessAction | DeleteFailAction |
  LoadAction | LoadSuccessAction | LoadFailAction |
  SwapAction | SwapSuccessAction | SwapFailAction;

