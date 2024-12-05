// components/Navbar.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Navbar = ({ onMenuPress }) => {
  return (
    <View style={styles.navbarContainer}>
      <TouchableOpacity onPress={onMenuPress}>
        <Ionicons name="menu-outline" size={30} color="white" />
      </TouchableOpacity>
      <Text style={styles.navbarTitle}>Shopping List</Text>
      <View style={{ width: 30 }} /> {/* Placeholder for balance */}
    </View>
  );
};

const styles = StyleSheet.create({
  navbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#4CAF50',
    height: 60,
  },
  navbarTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Navbar;
