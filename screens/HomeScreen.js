import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import ShoppingList from '../components/ShoppingList';
import AddItemForm from '../components/AddItemForm';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* <AddItemForm /> */}
      <ShoppingList />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#A2DBFA',
    
  },
});

export default HomeScreen;
