import { ADD_ITEM, REMOVE_ITEM, EDIT_ITEM, TOGGLE_ITEM } from './actionTypes';

const initialState = {
  items: [],
};

const shoppingListReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ITEM:
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case EDIT_ITEM:
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload.updatedItem } : item
        ),
      };
    case TOGGLE_ITEM:
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload ? { ...item, purchased: !item.purchased } : item
        ),
      };
    default:
      return state;
  }
};

export default shoppingListReducer;
