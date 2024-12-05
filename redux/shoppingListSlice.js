import { createSlice } from '@reduxjs/toolkit';
import { loadShoppingList, saveShoppingList } from '../utils/storage';

const initialState = [];

const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState,
  reducers: {
    setShoppingList: (state, action) => {
      return action.payload;
    },
    addItem: (state, action) => {
      const newItem = {
        id: Date.now(),
        name: action.payload.name,
        quantity: action.payload.quantity,
        purchased: false,
      };
      state.push(newItem);
      saveShoppingList(state); // Save to AsyncStorage
    },
    editItem: (state, action) => {
      const { id, name, quantity } = action.payload;
      const item = state.find(item => item.id === id);
      if (item) {
        item.name = name;
        item.quantity = quantity;
        saveShoppingList(state); // Save to AsyncStorage
      }
    },
    deleteItem: (state, action) => {
      const newState = state.filter(item => item.id !== action.payload);
      saveShoppingList(newState); // Save to AsyncStorage
      return newState;
    },
    toggleItem: (state, action) => {
      const item = state.find(item => item.id === action.payload);
      if (item) {
        item.purchased = !item.purchased;
        saveShoppingList(state); // Save to AsyncStorage
      }
    },
  },
});

export const { setShoppingList, addItem, editItem, deleteItem, toggleItem } = shoppingListSlice.actions;

export const loadShoppingListFromStorage = () => async (dispatch) => {
  const shoppingList = await loadShoppingList();
  dispatch(setShoppingList(shoppingList)); // Dispatch the loaded list to the store
};

export default shoppingListSlice.reducer;
