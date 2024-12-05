import { ADD_ITEM, REMOVE_ITEM, EDIT_ITEM, TOGGLE_ITEM } from './actionTypes';

export const addItem = (item) => ({
  type: ADD_ITEM,
  payload: item,
});

export const removeItem = (id) => ({
  type: REMOVE_ITEM,
  payload: id,
});

export const editItem = (id, updatedItem) => ({
  type: EDIT_ITEM,
  payload: { id, updatedItem },
});

export const toggleItem = (id) => ({
  type: TOGGLE_ITEM,
  payload: id,
});
