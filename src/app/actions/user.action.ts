import { Action } from '@ngrx/store';
import { type } from '../utils/type.util';
import { ProjectModel, User } from '../domain';

export interface UserProject {
  user: User;
  projectId: string;
}

export const ActionTypes = {
  ADD: type('[User] Add User Project'),
  ADD_SUCCESS: type('[User] Add User Project Success'),
  ADD_FAIL: type('[User] Add User Project Fail'),
  UPDATE: type('[User] Update User Project'),
  UPDATE_SUCCESS: type('[User] Update User Project Success'),
  UPDATE_FAIL: type('[User] Update User Project Fail'),
  DELETE: type('[User] Delete User Project'),
  DELETE_SUCCESS: type('[User] Delete User Project Success'),
  DELETE_FAIL: type('[User] Delete User Project Fail'),
  LOAD: type('[User] Load User By Projects'),
  LOAD_SUCCESS: type('[User] Load User By Projects Success'),
  LOAD_FAIL: type('[User] Load User By Projects Fail'),
  SEARCH: type('[User] Search'),
  SEARCH_SUCCESS: type('[User] Search Success'),
  SEARCH_FAIL: type('[User] Search Fail'),
};

export class AddAction implements Action {
  type = ActionTypes.ADD;

  constructor(public payload: UserProject) {
  }
}

export class AddSuccessAction implements Action {
  type = ActionTypes.ADD_SUCCESS;

  constructor(public payload: User) {
  }
}

export class AddFailAction implements Action {
  type = ActionTypes.ADD_FAIL;

  constructor(public payload: string) {
  }
}

export class UpdateAction implements Action {
  type = ActionTypes.UPDATE;

  constructor(public payload: ProjectModel) {
  }
}

export class UpdateSuccessAction implements Action {
  type = ActionTypes.UPDATE_SUCCESS;

  constructor(public payload: User[]) {
  }
}

export class UpdateFailAction implements Action {
  type = ActionTypes.UPDATE_FAIL;

  constructor(public payload: string) {
  }
}

export class DeleteAction implements Action {
  type = ActionTypes.DELETE;

  constructor(public payload: UserProject) {
  }
}

export class DeleteSuccessAction implements Action {
  type = ActionTypes.DELETE_SUCCESS;

  constructor(public payload: User) {
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

  constructor(public payload: User[]) {
  }
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;

  constructor(public payload: string) {
  }
}

export class SearchAction implements Action {
  type = ActionTypes.SEARCH;

  constructor(public payload: string) {
  }
}

export class SearchSuccessAction implements Action {
  type = ActionTypes.SEARCH_SUCCESS;

  constructor(public payload: User[]) {
  }
}

export class SearchFailAction implements Action {
  type = ActionTypes.SEARCH_FAIL;

  constructor(public payload: string) {
  }
}


export type Actions = AddAction | AddSuccessAction | AddFailAction |
  UpdateAction | UpdateSuccessAction | UpdateFailAction |
  DeleteAction | DeleteSuccessAction | DeleteFailAction |
  LoadAction | LoadSuccessAction | LoadFailAction |
  SearchAction | SearchSuccessAction | SearchFailAction;

