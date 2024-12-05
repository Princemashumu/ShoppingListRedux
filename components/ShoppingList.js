import React, { useState } from 'react';
import { FlatList, Text, View, TextInput, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { deleteItem, toggleItem, editItem } from '../redux/shoppingListSlice';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library

const ShoppingList = () => {
  const shoppingList = useSelector(state => state.shoppingList);
  const dispatch = useDispatch();

  // State to manage the modal and edited item
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [newName, setNewName] = useState('');
  const [newQuantity, setNewQuantity] = useState('');

  // Function to handle the edit button click
  const handleEdit = (item) => {
    setCurrentItem(item);
    setNewName(item.name);
    setNewQuantity(item.quantity);
    setIsModalVisible(true);
  };

  // Function to submit the edited item
  const handleSaveEdit = () => {
    if (newName.trim() === '' || newQuantity.trim() === '') {
      alert('Please provide valid name and quantity');
      return;
    }

    dispatch(editItem({ id: currentItem.id, name: newName, quantity: newQuantity }));
    setIsModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={{ textDecorationLine: item.purchased ? 'line-through' : 'none' }}>
        {item.name} - {item.quantity}
      </Text>

      {/* Icon buttons */}
      <TouchableOpacity onPress={() => dispatch(toggleItem(item.id))} style={styles.iconButton}>
        <Icon name="check-circle" size={24} color="#4CAF50" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => dispatch(deleteItem(item.id))} style={styles.iconButton}>
        <Icon name="delete" size={24} color="#F44336" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleEdit(item)} style={styles.iconButton}>
        <Icon name="edit" size={24} color="#2196F3" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={shoppingList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      {/* Edit Modal */}
      {isModalVisible && (
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setIsModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <Text>Edit Item</Text>

              {/* Name Input with Icon */}
              <View style={styles.inputContainer}>
                <Icon name="edit" size={20} color="#888" />
                <TextInput
                  style={styles.input}
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="Enter new name"
                />
              </View>

              {/* Quantity Input with Icon */}
              <View style={styles.inputContainer}>
                <Icon name="add-shopping-cart" size={20} color="#888" />
                <TextInput
                  style={styles.input}
                  value={newQuantity}
                  onChangeText={setNewQuantity}
                  placeholder="Enter new quantity"
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity onPress={handleSaveEdit} style={styles.iconButton}>
                <Icon name="save" size={24} color="#4CAF50" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.iconButton}>
                <Icon name="cancel" size={24} color="#F44336" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  item: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay background
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginLeft: 10,
  },
  iconButton: {
    padding: 8,
    borderRadius: 50,
    marginLeft: 8,
  },
});

export default ShoppingList;
