import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { addItem } from '../redux/shoppingListSlice';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library

const AddItemForm = () => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const dispatch = useDispatch();

  const handleAddItem = () => {
    if (name.trim() && quantity.trim()) {
      dispatch(addItem({ name, quantity }));
      setName(''); // Clear name field after adding
      setQuantity(''); // Clear quantity field after adding
    }
  };

  return (
    <View style={styles.form}>
      {/* Name Input with Icon */}
      <View style={styles.inputContainer}>
        <Icon name="edit" size={20} color="#888" />
        <TextInput
          style={styles.input}
          placeholder="Item Name"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Quantity Input with Icon */}
      <View style={styles.inputContainer}>
        <Icon name="add-shopping-cart" size={20} color="#888" />
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />
      </View>

      {/* Add Item Button */}
      <TouchableOpacity style={styles.button} onPress={handleAddItem}>
        <Text style={styles.buttonText}>Add Item</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    marginBottom: 16,
    padding: 30,
    backgroundColor: '#f9f9f9', // Optional: Add a background color for the form area
    borderRadius: 10, // Optional: Add rounded corners for the form area
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12, // Increased space between inputs
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginLeft: 10,
    paddingHorizontal: 8,
    borderRadius: 5, // Rounded corners for input fields
  },
  button: {
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#4CAF50', // Green button color
    paddingVertical: 10,
    width: 120, // Set a fixed width for the button
    marginTop: 16, // Space above the button
    alignSelf: 'center', // Center the button horizontally
  },
  buttonText: {
    color: '#fff', // White text color
    fontSize: 16, // Slightly larger font size
    fontWeight: 'bold',
  },
});

export default AddItemForm;
