import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import HomeScreen from './screens/HomeScreen';
import { loadShoppingListFromStorage } from './redux/shoppingListSlice';

const App = () => {
  useEffect(() => {
    // Load shopping list from AsyncStorage when the app starts
    store.dispatch(loadShoppingListFromStorage());
  }, []);

  return (
    <Provider store={store}>
      <HomeScreen />
    </Provider>
  );
};

export default App;
