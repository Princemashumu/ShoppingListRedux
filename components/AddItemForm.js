import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity,Text,Button, StyleSheet } from 'react-native';
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
      setName('');
      setQuantity('');
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
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginLeft: 10,
    paddingHorizontal: 8,
  },
  button:{
    alignItems:'center',
    borderRadius:25,
    backgroundColor:'Orange',
    backgroundColor: '#4CAF50',
    padding:10,
    // Left:'30%',
    width:100,


  },
  buttonText: {
    color: '#fff', // White text color
    fontSize: 14, // Reduced font size
    fontWeight: 'bold',
  },
});

export default AddItemForm;
