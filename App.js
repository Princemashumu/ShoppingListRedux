import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons,AntDesign } from '@expo/vector-icons'; // You can use any icon library
import store from './redux/store';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen'; // Create ProfileScreen.js
import { loadShoppingListFromStorage } from './redux/shoppingListSlice';

const Drawer = createDrawerNavigator();

const SplashScreen = () => {
  return (
    <View style={styles.splashContainer}>
      <Image source={require('./assets/logo.png')} style={styles.logo} />
      <ActivityIndicator size="large" color="#4CAF50" />
    </View>
  );
};

const App = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    // Load shopping list from AsyncStorage when the app starts
    store.dispatch(loadShoppingListFromStorage());

    // Hide splash screen after 2 seconds
    setTimeout(() => {
      setIsSplashVisible(false);
    }, 2000); // 2 seconds delay for the splash screen
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        {isSplashVisible ? (
          <SplashScreen />
        ) : (
          <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen
              name="Home"
              component={HomeScreen}
              options={{
                drawerIcon: ({ focused, size }) => (
                  <Ionicons name="home-outline" size={size} color={focused ? '#7cc' : '#ccc'} />
                ),
              }}
            />
            <Drawer.Screen
              name="Profile"
              component={ProfileScreen} // Add ProfileScreen component here
              options={{
                drawerIcon: ({ focused, size }) => (
                  <Ionicons name="person-outline" size={size} color={focused ? '#7cc' : '#ccc'} />
                ),
              }}
            />
            <Drawer.Screen
              name="logout"
              component={ProfileScreen} // Add ProfileScreen component here
              options={{
                drawerIcon: ({ focused, size }) => (
                  <Ionicons name="log-out-outline" size={size} color={focused ? '#7cc' : '#ccc'} />
                ),
              }}
            />
          </Drawer.Navigator>
        )}
      </NavigationContainer>
    </Provider>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});

export default App;
