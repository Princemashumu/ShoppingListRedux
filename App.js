import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { View, Image, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import store from './redux/store';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import { loadShoppingListFromStorage } from './redux/shoppingListSlice';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      {/* First Section: Logo and Profile */}
      <View style={styles.drawerHeader}>
        <Image source={require('./assets/logo.png')} style={styles.drawerLogo} />
        {/* <View style={styles.profileCircle}>
          <Ionicons name="person-circle-outline" size={50} color="#fff" />
        </View> */}
      </View>

      {/* Middle Section: Menu Items */}
      <DrawerItemList {...props} />

      {/* Last Section: Logout */}
      <View style={styles.logoutSection}>
        <DrawerItem
          label="Logout"
          onPress={() => {
            console.log('Logout pressed');
            // Handle logout logic here
          }}
          icon={({ size, color }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          )}
        />
      </View>
    </DrawerContentScrollView>
  );
};

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
    store.dispatch(loadShoppingListFromStorage());
    setTimeout(() => {
      setIsSplashVisible(false);
    }, 2000);
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        {isSplashVisible ? (
          <SplashScreen />
        ) : (
          <Drawer.Navigator
            initialRouteName="Home"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
          >
            <Drawer.Screen
              name="Home"
              component={HomeScreen}
              options={{
                drawerIcon: ({ size, color }) => (
                  <Ionicons name="home-outline" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                drawerIcon: ({ size, color }) => (
                  <Ionicons name="person-outline" size={size} color={color} />
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
    backgroundColor: '#A2DBFA',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  drawerHeader: {
    margin:20,
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  drawerLogo: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 35,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutSection: {
    top:'200%',
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
  },
});


export default App;
