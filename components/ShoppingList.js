import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const ShoppingList = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false); // State to control visibility of the category input
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false); // Modal visibility for adding category
  const [isItemModalVisible, setIsItemModalVisible] = useState(false); // Modal visibility for adding item
  const [currentCategoryId, setCurrentCategoryId] = useState(null); // Store the id of the category for adding item
  const [editingItem, setEditingItem] = useState(null); // State to control editing of an item
  const [editingCategoryId, setEditingCategoryId] = useState(null); // Store the category id being edited

  // Load data from AsyncStorage on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedCategories = await AsyncStorage.getItem('categories');
        if (savedCategories) {
          setCategories(JSON.parse(savedCategories));
        }
      } catch (error) {
        console.error('Failed to load data from AsyncStorage', error);
      }
    };
    loadData();
  }, []);

  // Save data to AsyncStorage whenever categories change
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('categories', JSON.stringify(categories));
      } catch (error) {
        console.error('Failed to save data to AsyncStorage', error);
      }
    };
    if (categories.length > 0) {
      saveData();
    }
  }, [categories]);

  const handleAddCategory = () => {
    if (newCategoryName.trim() && !categories.some(category => category.name === newCategoryName.trim())) {
      const newCategory = {
        id: categories.length + 1,
        name: newCategoryName,
        items: [],
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
      setIsCategoryModalVisible(false);
    } else {
      Alert.alert('Category already exists', 'Please choose a different category name.');
    }
  };
  

  const handleEditCategory = () => {
    if (editingCategoryId !== null && newCategoryName.trim()) {
      const updatedCategories = categories.map((category) =>
        category.id === editingCategoryId
          ? { ...category, name: newCategoryName }
          : category
      );
      setCategories(updatedCategories);
      setNewCategoryName('');
      setEditingCategoryId(null);
      setIsCategoryModalVisible(false); // Close the category modal after editing
    }
  };

  const handleDeleteCategory = (categoryId) => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            const updatedCategories = categories.filter((category) => category.id !== categoryId);
            setCategories(updatedCategories);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleAddItemToCategory = () => {
    if (newItemName.trim() && newItemQuantity.trim()) {
      const updatedCategories = categories.map((category) =>
        category.id === currentCategoryId
          ? {
              ...category,
              items: [
                ...category.items,
                { id: Date.now(), name: newItemName, quantity: newItemQuantity, completed: false },
              ],
            }
          : category
      );
      setCategories(updatedCategories);
      setNewItemName('');
      setNewItemQuantity('');
      setIsItemModalVisible(false);
    }
  };
  
  const handleEditItem = () => {
    if (editingItem && newItemName.trim() && newItemQuantity.trim()) {
      const updatedCategories = categories.map((category) =>
        category.id === currentCategoryId
          ? {
              ...category,
              items: category.items.map((item) =>
                item.id === editingItem.id
                  ? { ...item, name: newItemName, quantity: newItemQuantity }
                  : item
              ),
            }
          : category
      );
      setCategories(updatedCategories);
      setEditingItem(null);
      setNewItemName('');
      setNewItemQuantity('');
      setIsItemModalVisible(false); // Close the item modal after editing
    }
  };

  const handleDeleteItem = (categoryId, itemId) => {
    const updatedCategories = categories.map((category) =>
      category.id === categoryId
        ? {
            ...category,
            items: category.items.filter((item) => item.id !== itemId),
          }
        : category
    );
    setCategories(updatedCategories);
  };

  const handleToggleItem = (categoryId, itemId) => {
    const updatedCategories = categories.map((category) =>
      category.id === categoryId
        ? {
            ...category,
            items: category.items.map((item) =>
              item.id === itemId ? { ...item, completed: !item.completed } : item
            ),
          }
        : category
    );
    setCategories(updatedCategories);
  };

  const renderItem = ({ item, categoryId }) => (
    <View style={styles.item}>
      <Text style={item.completed ? styles.completedItem : null}>
        {item.name} - {item.quantity}
      </Text>

      <View style={styles.itemActions}>
        <TouchableOpacity onPress={() => { setEditingItem(item); setNewItemName(item.name); setNewItemQuantity(item.quantity); setIsItemModalVisible(true); }}>
          <Icon name="edit" size={20} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteItem(categoryId, item.id)}>
          <Icon name="delete" size={20} color="#f44336" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleToggleItem(categoryId, item.id)}>
          <Icon name={item.completed ? "check-box" : "check-box-outline-blank"} size={20} color="#2196F3" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategory = ({ item }) => (
    <View style={styles.category}>
      <View style={styles.categoryHeader}>
        {editingCategoryId === item.id ? (
          <TextInput
            style={styles.input}
            value={newCategoryName}
            onChangeText={setNewCategoryName}
            autoFocus
          />
        ) : (
          <Text style={styles.categoryTitle}>{item.name}</Text>
        )}
        <View style={styles.categoryActions}>
          {editingCategoryId === item.id ? (
            <TouchableOpacity onPress={handleEditCategory}>
              <Icon name="check" size={20} color="#4CAF50" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => { setEditingCategoryId(item.id); setNewCategoryName(item.name); }}>
              <Icon name="edit" size={20} color="#4CAF50" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => handleDeleteCategory(item.id)}>
            <Icon name="delete" size={20} color="#f44336" />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={item.items}
        renderItem={(props) => renderItem({ ...props, categoryId: item.id })}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity
        style={styles.addItemButton}
        onPress={() => {
          setCurrentCategoryId(item.id); // Set the current category ID
          setIsItemModalVisible(true); // Show the item modal
        }}
      >
        <Icon name="add-shopping-cart" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Add Category Button */}
      <TouchableOpacity
        style={styles.addCategoryButton}
        onPress={() => setIsCategoryModalVisible(true)} // Show the category modal when clicked
      >
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>

    {/* Modal for Add/Edit Category */}
<Modal
  visible={isCategoryModalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setIsCategoryModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>
        {editingCategoryId ? "Edit Category" : "Add Category"}
      </Text>
      <TextInput
        style={[
          styles.input, 
          // You could add a focused state handler here if desired
          // isFocused && styles.inputFocused
        ]}
        value={newCategoryName}
        onChangeText={setNewCategoryName}
        placeholder="Enter category name"
        placeholderTextColor="#A9A9A9"
      />
      <View style={styles.modalButtonContainer}>
        <TouchableOpacity 
          style={[styles.modalButton, styles.modalButtonSecondary]}
          onPress={() => setIsCategoryModalVisible(false)}
        >
          <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.modalButton, styles.modalButtonPrimary]}
          onPress={editingCategoryId ? handleEditCategory : handleAddCategory}
        >
          <Text style={styles.modalButtonText}>
            {editingCategoryId ? "Save" : "Add"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

{/* Modal for Add/Edit Item */}
<Modal
  visible={isItemModalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setIsItemModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>
        {editingItem ? "Edit Item" : "Add Item"}
      </Text>
      <TextInput
        style={styles.input}
        value={newItemName}
        onChangeText={setNewItemName}
        placeholder="Enter item name"
        placeholderTextColor="#A9A9A9"
      />
      <TextInput
        style={styles.input}
        value={newItemQuantity}
        onChangeText={setNewItemQuantity}
        placeholder="Enter quantity"
        keyboardType="numeric"
        placeholderTextColor="#A9A9A9"
      />
      <View style={styles.modalButtonContainer}>
        <TouchableOpacity 
          style={[styles.modalButton, styles.modalButtonSecondary]}
          onPress={() => setIsItemModalVisible(false)}
        >
          <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.modalButton, styles.modalButtonPrimary]}
          onPress={editingItem ? handleEditItem : handleAddItemToCategory}
        >
          <Text style={styles.modalButtonText}>
            {editingItem ? "Save" : "Add"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF8F3', // Softer background color
      paddingTop: 20,
      paddingHorizontal: 15,
    },
    category: {
      marginBottom: 15,
    //   backgroundColor: '#FFFFFF',
    backgroundColor:'#758694',
      borderRadius: 12, // Slightly more rounded corners
      padding: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3, // Softer shadow
    },
    categoryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#E9E9E9',
      paddingBottom: 10,
      marginBottom: 10,
    },
    categoryTitle: {
      fontSize: 20,
      fontWeight: '700', // Slightly bolder
      color: '#2C3E50', // Deeper, more professional color
    },
    categoryActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap:10
    },
    item: {
      marginTop: 10,
      padding: 12,
      backgroundColor: '#F4F6F8', // Lighter background
      borderRadius: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    itemText: {
      flex: 1,
      fontSize: 16,
      color: '#34495E',
    },
    completedItem: {
      textDecorationLine: 'line-through',
      color: '#95A5A6',
    },
    itemActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap:10
    },
    addItemButton: {
      marginTop: 15,
      backgroundColor: '#F45050', // Brighter, more vibrant 
      paddingVertical: 12,
      borderRadius: 25,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    addCategoryButton: {
      position: 'absolute',
      bottom: 25,
      right: 25,
      backgroundColor: '#F45050', // Vibrant green
      width: 65,
      height: 65,
      borderRadius: 35,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    input: {
      height: 45, // Slightly taller input
      borderColor: '#BDC3C7',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 12,
      backgroundColor: '#FFFFFF',
      fontSize: 16,
    },
    modal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)', // Slightly darker overlay
      padding: 20,
    },
    modalButton: {
      backgroundColor: '#F45050',
      color: '#FFFFFF',
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 8,
      marginTop: 12,
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    // Modal Enhancements
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Soft, semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '90%', // Slightly narrower than full width
    backgroundColor: '#FFFFFF',
    borderRadius: 15, // More pronounced rounded corners
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50, // Taller input
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
    fontSize: 16,
    color: '#2C3E50',
  },
  inputFocused: {
    borderColor: '#3498DB',
    backgroundColor: '#FFFFFF',
    shadowColor: '#3498DB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#F45050',
    marginRight: 10,
  },
  modalButtonSecondary: {
    backgroundColor: '#E0E0E0',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonSecondaryText: {
    color: '#2C3E50',
    fontSize: 16,
    fontWeight: '600',
  },
  });


export default ShoppingList;
