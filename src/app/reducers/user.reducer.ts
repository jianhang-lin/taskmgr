import * as actions from '../actions/user.action';
import * as prjActions from '../actions/project.action';
import { ProjectModel, User } from '../domain';
import * as _ from 'lodash';
import { createSelector } from 'reselect';

export interface State {
  ids: string[];
  entities: {[id: string]: User};
}

export const initialState: State = {
  ids: [],
  entities: {}
};

const addUser = (state, action) => {
  const user = action.payload;
  const newIds = [...state.ids, user.id];
  const newEntities = {...state.entities, [user.id]: user};
  return state.entities[user.id] ? {...state, entities: newEntities} : {...state, ids: newIds, entities: newEntities};
};

const delUser = (state, action) => {
  const user = action.payload;
  const newEntities = {...state.entities, [user.id]: user};
  return state.entities[user.id] ? {...state, entities: newEntities} : state;
};

const updateUser = (state, action) => {
  const users = action.payload as User[];
  const incomingEntities = _.chain(users).keyBy('id').mapValues(o => o).value();
  const newEntities = {...state.entities, ...incomingEntities};
  return {...state, entities: newEntities};
};

const loadUsers = (state, action) => {
  const users = action.payload;
  const incomingIds = users.map(p => p.id);
  const newIds = _.difference(incomingIds, state.ids);
  const incomingEntities = _.chain(users).keyBy('id').mapValues(o => o).value();
  // @ts-ignore
  const newEntities = newIds.reduce((entities, id: string) => ({...entities, [id]: incomingEntities[id]}), {});
  return {
    ...state,
    ids: [...state.ids, ...newIds],
    // @ts-ignore
    entities: {...state.entities, ...newEntities},
  };
};

export function reducer(state = initialState, action: actions.Actions | any ): State {
  switch (action.type) {
    case actions.ActionTypes.ADD_SUCCESS: {
      return addUser(state, action);
    }
    case actions.ActionTypes.DELETE_SUCCESS: {
      return delUser(state, action);
    }
    case actions.ActionTypes.UPDATE_SUCCESS: {
      return updateUser(state, action);
    }
    case actions.ActionTypes.SEARCH_SUCCESS:
    case actions.ActionTypes.LOAD_SUCCESS: {
      return loadUsers(state, action);
    }
    default: {
      return state;
    }
  }
}

export const getIds = (state: State) => state.ids;
export const getEntities = (state: State) => state.entities;

export const getUsers = createSelector(getIds, getEntities, (ids, entities) => {
  return ids.map(id => entities[id]);
});
