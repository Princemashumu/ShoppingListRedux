import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'shoppingList';

export const loadShoppingList = async () => {
  try {
    const storedList = await AsyncStorage.getItem(STORAGE_KEY);
    return storedList ? JSON.parse(storedList) : [];
  } catch (error) {
    console.error('Failed to load shopping list', error);
    return [];
  }
};

export const saveShoppingList = async (list) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (error) {
    console.error('Failed to save shopping list', error);
  }
};
