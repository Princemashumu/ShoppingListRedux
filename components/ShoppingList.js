import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Modal,  Alert, ToastAndroid, Platform,ScrollView } from 'react-native';
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
  const [expandedCategories, setExpandedCategories] = useState({});

  
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

// Helper function for cross-platform toast notifications
const showToast = (message) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    // For iOS, you might want to use a different toast library or Alert
    Alert.alert('Notification', message);
  }
};



const handleAddCategory = () => {
  try {
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Category name cannot be empty.');
      return;
    }

    if (categories.some(category => category.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      Alert.alert('Error', 'A category with this name already exists.');
      return;
    }

    const newCategory = {
      id: categories.length + 1,
      name: newCategoryName.trim(),
      items: [],
    };
    
    setCategories([...categories, newCategory]);
    setNewCategoryName('');
    setIsCategoryModalVisible(false);
    
    // Show success toast
    showToast(`Category "${newCategory.name}" added successfully`);
  } catch (error) {
    console.error('Error adding category:', error);
    Alert.alert('Error', 'Failed to add category. Please try again.');
  }
};

const handleEditCategory = () => {
  try {
    if (editingCategoryId === null) {
      Alert.alert('Error', 'No category selected for editing.');
      return;
    }

    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Category name cannot be empty.');
      return;
    }

    // Check for duplicate category names, excluding the current category being edited
    if (categories.some(category => 
      category.id !== editingCategoryId && 
      category.name.toLowerCase() === newCategoryName.trim().toLowerCase()
    )) {
      Alert.alert('Error', 'A category with this name already exists.');
      return;
    }

    const oldCategoryName = categories.find(c => c.id === editingCategoryId)?.name;
    
    const updatedCategories = categories.map((category) =>
      category.id === editingCategoryId
        ? { ...category, name: newCategoryName.trim() }
        : category
    );
    
    setCategories(updatedCategories);
    setNewCategoryName('');
    setEditingCategoryId(null);
    setIsCategoryModalVisible(false);
    
    // Show success toast
    showToast(`Category renamed from "${oldCategoryName}" to "${newCategoryName}"`);
  } catch (error) {
    console.error('Error editing category:', error);
    Alert.alert('Error', 'Failed to edit category. Please try again.');
  }
};

const handleDeleteCategory = (categoryId) => {
  const categoryToDelete = categories.find(category => category.id === categoryId);
  
  Alert.alert(
    'Delete Category',
    `Are you sure you want to delete the category "${categoryToDelete.name}"?`,
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          try {
            const updatedCategories = categories.filter((category) => category.id !== categoryId);
            setCategories(updatedCategories);
            
            // Show success toast
            showToast(`Category "${categoryToDelete.name}" deleted successfully`);
          } catch (error) {
            console.error('Error deleting category:', error);
            Alert.alert('Error', 'Failed to delete category. Please try again.');
          }
        },
      },
    ],
    { cancelable: false }
  );
};

const handleAddItemToCategory = () => {
  try {
    if (!newItemName.trim()) {
      Alert.alert('Error', 'Item name cannot be empty.');
      return;
    }

    if (!newItemQuantity.trim()) {
      Alert.alert('Error', 'Item quantity cannot be empty.');
      return;
    }

    // Check if the item already exists in the category
    const categoryToUpdate = categories.find(category => category.id === currentCategoryId);
    if (categoryToUpdate.items.some(item => 
      item.name.toLowerCase() === newItemName.trim().toLowerCase()
    )) {
      Alert.alert('Error', 'An item with this name already exists in this category.');
      return;
    }

    const newItem = {
      id: Date.now(),
      name: newItemName.trim(),
      quantity: newItemQuantity.trim(),
      completed: false
    };

    const updatedCategories = categories.map((category) =>
      category.id === currentCategoryId
        ? {
            ...category,
            items: [...category.items, newItem],
          }
        : category
    );
    
    setCategories(updatedCategories);
    setNewItemName('');
    setNewItemQuantity('');
    setIsItemModalVisible(false);
    
    // Show success toast
    showToast(`Item "${newItem.name}" added to category`);
  } catch (error) {
    console.error('Error adding item:', error);
    Alert.alert('Error', 'Failed to add item. Please try again.');
  }
};

const handleEditItem = () => {
  try {
    if (!editingItem) {
      Alert.alert('Error', 'No item selected for editing.');
      return;
    }

    if (!newItemName.trim()) {
      Alert.alert('Error', 'Item name cannot be empty.');
      return;
    }

    if (!newItemQuantity.trim()) {
      Alert.alert('Error', 'Item quantity cannot be empty.');
      return;
    }

    // Check if the item name is being changed to an existing item name
    const categoryToUpdate = categories.find(category => category.id === currentCategoryId);
    if (categoryToUpdate.items.some(item => 
      item.id !== editingItem.id && 
      item.name.toLowerCase() === newItemName.trim().toLowerCase()
    )) {
      Alert.alert('Error', 'An item with this name already exists in this category.');
      return;
    }

    const updatedCategories = categories.map((category) =>
      category.id === currentCategoryId
        ? {
            ...category,
            items: category.items.map((item) =>
              item.id === editingItem.id
                ? { 
                    ...item, 
                    name: newItemName.trim(), 
                    quantity: newItemQuantity.trim() 
                  }
                : item
            ),
          }
        : category
    );
    
    setCategories(updatedCategories);
    setEditingItem(null);
    setNewItemName('');
    setNewItemQuantity('');
    setIsItemModalVisible(false);
    
    // Show success toast
    showToast(`Item "${newItemName}" updated successfully`);
  } catch (error) {
    console.error('Error editing item:', error);
    Alert.alert('Error', 'Failed to edit item. Please try again.');
  }
};

const handleDeleteItem = (categoryId, itemId) => {
  try {
    const categoryToUpdate = categories.find(category => category.id === categoryId);
    const itemToDelete = categoryToUpdate.items.find(item => item.id === itemId);

    const updatedCategories = categories.map((category) =>
      category.id === categoryId
        ? {
            ...category,
            items: category.items.filter((item) => item.id !== itemId),
          }
        : category
    );
    
    setCategories(updatedCategories);
    
    // Show success toast
    showToast(`Item "${itemToDelete.name}" deleted successfully`);
  } catch (error) {
    console.error('Error deleting item:', error);
    Alert.alert('Error', 'Failed to delete item. Please try again.');
  }
};

const handleToggleItem = (categoryId, itemId) => {
  try {
    const updatedCategories = categories.map((category) =>
      category.id === categoryId
        ? {
            ...category,
            items: category.items.map((item) =>
              item.id === itemId 
                ? { ...item, completed: !item.completed } 
                : item
            ),
          }
        : category
    );
    
    setCategories(updatedCategories);
    
    // Determine the new status for toast message
    const categoryToUpdate = updatedCategories.find(category => category.id === categoryId);
    const toggledItem = categoryToUpdate.items.find(item => item.id === itemId);
    
    // Show toast with item status
    showToast(`Item "${toggledItem.name}" marked as ${toggledItem.completed ? 'completed' : 'pending'}`);
  } catch (error) {
    console.error('Error toggling item:', error);
    Alert.alert('Error', 'Failed to update item status. Please try again.');
  }
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
              <Icon name="edit" size={20} color="white" />
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
// Toggle category expansion
const toggleCategoryExpansion = (categoryId) => {
  setExpandedCategories(prev => ({
    ...prev,
    [categoryId]: !prev[categoryId]
  }));
};

  return (
    <View style={styles.container}>
    <ScrollView 
      contentContainerStyle={styles.scrollViewContainer}
      showsVerticalScrollIndicator={false}
    >
      {categories.map((category) => (
        <View key={category.id} style={styles.category}>
          <TouchableOpacity 
            style={styles.categoryHeader} 
            onPress={() => toggleCategoryExpansion(category.id)}
          >
            {editingCategoryId === category.id ? (
              <TextInput
                style={styles.input}
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                autoFocus
              />
            ) : (
              <Text style={styles.categoryTitle}>{category.name}</Text>
            )}
            
            <View style={styles.categoryActions}>
              {editingCategoryId === category.id ? (
                <TouchableOpacity onPress={handleEditCategory}>
                  <Icon name="check" size={20} color="#4CAF50" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => { 
                  setEditingCategoryId(category.id); 
                  setNewCategoryName(category.name); 
                }}>
                  <Icon name="edit" size={20} color="white" />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => handleDeleteCategory(category.id)}>
                <Icon name="delete" size={20} color="#f44336" />
              </TouchableOpacity>
              <Icon 
                name={expandedCategories[category.id] ? "expand-less" : "expand-more"} 
                size={20} 
                color="white" 
              />
            </View>
          </TouchableOpacity>

          {expandedCategories[category.id] && (
            <View>
              {category.items.map((itemDetail) => (
                <View key={itemDetail.id} style={styles.item}>
                  <Text style={itemDetail.completed ? styles.completedItem : null}>
                    {itemDetail.name} - {itemDetail.quantity}
                  </Text>
                  <View style={styles.itemActions}>
                    <TouchableOpacity onPress={() => { 
                      setEditingItem(itemDetail); 
                      setNewItemName(itemDetail.name); 
                      setNewItemQuantity(itemDetail.quantity); 
                      setIsItemModalVisible(true); 
                    }}>
                      <Icon name="edit" size={20} color="#4CAF50" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteItem(category.id, itemDetail.id)}>
                      <Icon name="delete" size={20} color="#f44336" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleToggleItem(category.id, itemDetail.id)}>
                      <Icon name={itemDetail.completed ? "check-box" : "check-box-outline-blank"} size={20} color="#2196F3" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              
              <TouchableOpacity
                style={styles.addItemButton}
                onPress={() => {
                  setCurrentCategoryId(category.id);
                  setIsItemModalVisible(true);
                }}
              >
                <Icon name="add-shopping-cart" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
    </ScrollView>

    <TouchableOpacity
      style={styles.addCategoryButton}
      onPress={() => setIsCategoryModalVisible(true)}
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
            style={styles.input}
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
      backgroundColor: '#A2DBFA', // Softer background color
      paddingTop: 20,
      paddingHorizontal: 15,
    },
    category: {
      marginBottom: 15,
    //   backgroundColor: '#FFFFFF',
    backgroundColor:'#39A2DB',
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
      backgroundColor: '#053742', // Brighter, more vibrant 
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
      backgroundColor: '#053742', // Vibrant green
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
      borderColor: '#39A2DB',
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
      backgroundColor: '#053742',
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
    backgroundColor: '#39A2DB',
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
    borderColor: '#39A2DB',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
    fontSize: 16,
    color: '#2C3E50',
  },
  inputFocused: {
    borderColor: '#39A2DB',
    backgroundColor: '#FFFFFF',
    shadowColor: '#39A2DB',
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
    gap:20
  },
  modalButtonPrimary: {
    backgroundColor: '#053742',
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
