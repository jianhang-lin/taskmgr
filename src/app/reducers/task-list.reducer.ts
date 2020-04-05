import * as actions from '../actions/task-list.action';
import * as prjActions from '../actions/project.action';
import { ProjectModel, TaskListModel } from '../domain';
import * as _ from 'lodash';
import { createSelector } from 'reselect';

export interface State {
  ids: string[];
  entities: {[id: string]: TaskListModel};
  selectedIds: string[];
}

export const initialState: State = {
  ids: [],
  entities: {},
  selectedIds: null,
};

const addTaskList = (state, action) => {
  const taskList = action.payload;
  if (state.entities[taskList.id]) {
    return state;
  }
  const newIds = [...state.ids, taskList.id];
  const newEntities = {...state.entities, [taskList.id]: taskList};
  return {...state, ids: newIds, entities: newEntities};
};

const delTaskList = (state, action) => {
  const taskList = action.payload;
  const newIds = state.ids.filter(id => id !== taskList.id);
  const newEntities = newIds.reduce((entities, id: string) => ({...entities, [id]: state.entities[id]}), {});
  const newSelectedIds = state.selectedIds.filter(id => id !== taskList.id);
  return {
    ids: newIds,
    entities: newEntities,
    selectedIds: newSelectedIds
  };
};

const updateTaskList = (state, action) => {
  const taskList = action.payload;
  const newEntities = {...state.entities, [taskList.id]: taskList};
  return {...state, entities: newEntities};
};

const loadTaskLists = (state, action) => {
  const taskLists = action.payload;
  const incomingIds = taskLists.map(p => p.id);
  const newIds = _.difference(incomingIds, state.ids);
  const incomingEntities = _.chain(taskLists).keyBy('id').mapValues(o => o).value();
  // @ts-ignore
  const newEntities = newIds.reduce((entities, id: string) => ({...entities, [id]: incomingEntities[id]}), {});
  return {
    ...state,
    ids: [...state.ids, ...newIds],
    // @ts-ignore
    entities: {...state.entities, ...newEntities},
  };
};

const swapTaskLists = (state, action) => {
  const taskLists = action.payload as TaskListModel[];
  const updateEntities = _.chain(taskLists).keyBy('id').mapValues(o => o).value();
  const newEntities = {...state.entities, ...updateEntities};
  return {
    ...state,
    entities: newEntities
  };
};

const selectPrj = (state, action) => {
  const selected = action.payload as ProjectModel;
  const selectedIds = state.ids.filter(id => state.entities[id].projectId === selected.id);
  return {
    ...state,
    selectedIds
  };
};

const delListsByPrj = (state, action) => {
  const project = action.payload as ProjectModel;
  const taskListIds = project.taskLists;
  const remainingIds = _.difference(state.ids, taskListIds);
  const remainingEntities = remainingIds.reduce((entities, id) => ({...entities, [id]: state.entities[id]}), {});
  return {
    ids: [...remainingIds],
    entities: remainingEntities,
    selectedIds: []
  };
};

export function reducer(state = initialState, action: actions.Actions | any ): State {
  switch (action.type) {
    case actions.ActionTypes.ADD_SUCCESS: {
      return addTaskList(state, action);
    }
    case actions.ActionTypes.DELETE_SUCCESS: {
      return delTaskList(state, action);
    }
    case actions.ActionTypes.UPDATE_SUCCESS: {
      return updateTaskList(state, action);
    }
    case actions.ActionTypes.LOAD_SUCCESS: {
      return loadTaskLists(state, action);
    }
    case actions.ActionTypes.SWAP_SUCCESS: {
      return swapTaskLists(state, action);
    }
    case prjActions.ActionTypes.SELECT_PROJECT: {
      return selectPrj(state, action);
    }
    case prjActions.ActionTypes.DELETE_SUCCESS: {
      return delListsByPrj(state, action);
    }
    default: {
      return state;
    }
  }
}

export const getIds = (state: State) => state.ids;
export const getEntities = (state: State) => state.entities;
export const getSelectedIds = (state: State) => state.selectedIds;

export const getSelected = createSelector(getIds, getEntities, (ids, entities) => {
  return ids.map(id => entities[id]);
});
