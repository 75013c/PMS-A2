// 24832452 HongyuLiu

import { Component } from '@angular/core';

// Type definitions for constrained field values
type Category = 'Electronics' | 'Furniture' | 'Clothing' | 'Tools' | 'Miscellaneous';
type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';
type PopularItem = 'Yes' | 'No';
type MessageType = 'success' | 'error' | 'info' | '';
type SectionType = 'home' | 'management' | 'search' | 'inventory' | 'security' | 'help';

// Main inventory item data model
export interface InventoryItem {
  itemId: string;
  itemName: string;
  category: Category;
  quantity: number;
  price: number;
  supplierName: string;
  stockStatus: StockStatus;
  popularItem: PopularItem;
  comment: string;
}

// Form data model used before conversion to typed inventory items
export interface FormDataShape {
  itemId: string;
  itemName: string;
  category: string;
  quantity: string;
  price: string;
  supplierName: string;
  stockStatus: string;
  popularItem: string;
  comment: string;
}

// Root application component
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  // Session storage key for inventory persistence
  readonly STORAGE_KEY = 'inventory_session_data';

  // Default inventory records loaded when no saved session data exists
  readonly defaultInventory: InventoryItem[] = [
    {
      itemId: 'E101',
      itemName: 'Smart TV',
      category: 'Electronics',
      quantity: 12,
      price: 799.99,
      supplierName: 'VisionTech',
      stockStatus: 'In Stock',
      popularItem: 'Yes',
      comment: 'Top-selling 55 inch model'
    },
    {
      itemId: 'F201',
      itemName: 'Office Chair',
      category: 'Furniture',
      quantity: 4,
      price: 149.5,
      supplierName: 'Comfort Seating',
      stockStatus: 'Low Stock',
      popularItem: 'No',
      comment: 'Ergonomic design'
    },
    {
      itemId: 'C301',
      itemName: 'Winter Jacket',
      category: 'Clothing',
      quantity: 15,
      price: 89.99,
      supplierName: 'UrbanWear',
      stockStatus: 'In Stock',
      popularItem: 'Yes',
      comment: 'Water-resistant material'
    },
    {
      itemId: 'T401',
      itemName: 'Cordless Drill',
      category: 'Tools',
      quantity: 3,
      price: 129.99,
      supplierName: 'BuildPro',
      stockStatus: 'Low Stock',
      popularItem: 'No',
      comment: 'Includes battery and charger'
    },
    {
      itemId: "E102",
      itemName: "iPhone",
      category: "Electronics",
      quantity: 34,
      price: 999.99,
      supplierName: "Apple",
      stockStatus: "In Stock",
      popularItem: "Yes",
      comment: "The best smartphone"
    }
  ];

  // Main application state
  inventory: InventoryItem[] = [];
  displayedInventoryItems: InventoryItem[] = [];
  searchResults: InventoryItem[] = [];

  // Current visible section and current management panel
  currentSection: SectionType = 'home';
  currentPanel: 'add' | 'update' | 'delete' | '' = '';

  // Temporary state for update and delete workflows
  currentEditingItemName = '';
  pendingDeleteName = '';

  // Message state for the management section
  managementMessage = '';
  managementMessageType: MessageType = '';

  // Message and results state for the search section
  searchMessage = '';
  searchMessageType: MessageType = '';
  searchResultsInfo = 'No search performed yet.';

  // Message and results state for the inventory section
  inventoryMessage = '';
  inventoryMessageType: MessageType = '';
  inventoryResultsInfo = '';

  // Search input state
  searchKeyword = '';

  // Form state for add and update operations
  addForm: FormDataShape = this.createEmptyForm();
  updateForm: FormDataShape = this.createEmptyForm();

  // Additional input state for load and delete operations
  loadItemName = '';
  deleteItemName = '';

  // Initialize saved data and default inventory display
  constructor() {
    this.inventory = this.loadInventory();
    this.displayedInventoryItems = [...this.inventory];
    this.inventoryResultsInfo = `Displaying all ${this.inventory.length} item(s).`;
  }

  // Create a blank form object
  createEmptyForm(): FormDataShape {
    return {
      itemId: '',
      itemName: '',
      category: '',
      quantity: '',
      price: '',
      supplierName: '',
      stockStatus: '',
      popularItem: '',
      comment: ''
    };
  }

  // Load inventory from session storage or initialize with default data
  loadInventory(): InventoryItem[] {
    const saved = sessionStorage.getItem(this.STORAGE_KEY);

    if (saved) {
      return JSON.parse(saved) as InventoryItem[];
    }

    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.defaultInventory));
    return [...this.defaultInventory];
  }

  // Save current inventory data to session storage
  saveData(): void {
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.inventory));
  }

  // Normalize item names for trimmed, case-insensitive comparison
  normalise(name: string): string {
    return name.trim().toLowerCase();
  }

  // Find an inventory item by item name
  findItemByName(name: string): InventoryItem | undefined {
    return this.inventory.find(
      (item: InventoryItem): boolean => this.normalise(item.itemName) === this.normalise(name)
    );
  }

  // Find the index of an inventory item by item name
  findIndexByName(name: string): number {
    return this.inventory.findIndex(
      (item: InventoryItem): boolean => this.normalise(item.itemName) === this.normalise(name)
    );
  }

  // Switch between main application sections
  switchSection(section: SectionType, event?: Event): void {
    event?.preventDefault();
    this.currentSection = section;

    if (section === 'inventory') {
      this.showAllItems();
    }
  }

  // Set the currently visible management panel
  setPanel(type: 'add' | 'update' | 'delete'): void {
    this.currentPanel = type;
    this.clearManagementMessage();
  }

  // Validate form data before add or update operations
  validateForm(data: FormDataShape, isUpdate: boolean = false): string[] {
    const errors: string[] = [];

    const itemId = String(data.itemId ?? '').trim();
    const itemName = String(data.itemName ?? '').trim();
    const category = String(data.category ?? '').trim();
    const quantityValue = String(data.quantity ?? '').trim();
    const priceValue = String(data.price ?? '').trim();
    const supplierName = String(data.supplierName ?? '').trim();
    const stockStatus = String(data.stockStatus ?? '').trim();
    const popularItem = String(data.popularItem ?? '').trim();

    if (!isUpdate && itemId === '') {
      errors.push('Item ID is required.');
    }

    if (itemName === '') {
      errors.push('Item Name is required.');
    }

    if (category === '') {
      errors.push('Category is required.');
    }

    if (quantityValue === '') {
      errors.push('Quantity is required.');
    } else {
      const quantityNumber = Number(quantityValue);

      if (!Number.isInteger(quantityNumber) || quantityNumber < 0) {
        errors.push('Quantity must be a whole number greater than or equal to 0.');
      }
    }

    if (priceValue === '') {
      errors.push('Price is required.');
    } else if (Number.isNaN(Number(priceValue)) || Number(priceValue) < 0) {
      errors.push('Price must be a number greater than or equal to 0.');
    }

    if (supplierName === '') {
      errors.push('Supplier Name is required.');
    }

    if (stockStatus === '') {
      errors.push('Stock Status is required.');
    }

    if (popularItem === '') {
      errors.push('Popular Item is required.');
    }

    return errors;
  }

  // Convert form data into a typed inventory item object
  toInventoryItem(data: FormDataShape, existingId?: string): InventoryItem {
    return {
      itemId: existingId ?? data.itemId,
      itemName: data.itemName,
      category: data.category as Category,
      quantity: Number(data.quantity),
      price: Number(data.price),
      supplierName: data.supplierName,
      stockStatus: data.stockStatus as StockStatus,
      popularItem: data.popularItem as PopularItem,
      comment: data.comment
    };
  }

  // Set a message for the management section
  setManagementMessage(message: string, type: Exclude<MessageType, ''>): void {
    this.managementMessage = message;
    this.managementMessageType = type;
  }

  // Clear the management section message
  clearManagementMessage(): void {
    this.managementMessage = '';
    this.managementMessageType = '';
  }

  // Set a message for the search section
  setSearchMessage(message: string, type: Exclude<MessageType, ''>): void {
    this.searchMessage = message;
    this.searchMessageType = type;
  }

  // Clear the search section message
  clearSearchMessage(): void {
    this.searchMessage = '';
    this.searchMessageType = '';
  }

  // Set a message for the inventory section
  setInventoryMessage(message: string, type: Exclude<MessageType, ''>): void {
    this.inventoryMessage = message;
    this.inventoryMessageType = type;
  }

  // Clear the inventory section message
  clearInventoryMessage(): void {
    this.inventoryMessage = '';
    this.inventoryMessageType = '';
  }

  // Reset the add form
  clearAddForm(): void {
    this.addForm = this.createEmptyForm();
  }

  // Reset the update form and editing state
  clearUpdateForm(): void {
    this.loadItemName = '';
    this.updateForm = this.createEmptyForm();
    this.currentEditingItemName = '';
  }

  // Reset the delete form
  clearDeleteForm(): void {
    this.deleteItemName = '';
  }

  // Add a new item to the inventory
  addItem(): void {
    this.clearManagementMessage();

    const data = { ...this.addForm };
    const errors = this.validateForm(data);

    if (errors.length > 0) {
      this.setManagementMessage(errors.join('<br>'), 'error');
      return;
    }

    if (this.inventory.some((item: InventoryItem): boolean => item.itemId === data.itemId)) {
      this.setManagementMessage('Item ID must be unique. This Item ID already exists.', 'error');
      return;
    }

    if (this.findItemByName(data.itemName)) {
      this.setManagementMessage('Item Name already exists. Please use a different Item Name.', 'error');
      return;
    }

    this.inventory.push(this.toInventoryItem(data));
    this.saveData();
    this.clearAddForm();
    this.setManagementMessage(`Item <strong>${data.itemName}</strong> added successfully.`, 'success');

    if (this.currentSection === 'inventory') {
      this.showAllItems();
    }
  }

  // Load an existing item into the update form
  loadItem(): void {
    this.clearManagementMessage();

    const name = this.loadItemName.trim();

    if (name === '') {
      this.setManagementMessage('Enter the Item Name first to load it for editing.', 'error');
      return;
    }

    const item = this.findItemByName(name);

    if (!item) {
      this.setManagementMessage('Item not found.', 'error');
      return;
    }

    this.currentEditingItemName = item.itemName;
    this.updateForm = {
      itemId: item.itemId,
      itemName: item.itemName,
      category: item.category,
      quantity: item.quantity.toString(),
      price: item.price.toString(),
      supplierName: item.supplierName,
      stockStatus: item.stockStatus,
      popularItem: item.popularItem,
      comment: item.comment
    };

    this.setManagementMessage(`Item <strong>${item.itemName}</strong> loaded for editing.`, 'info');
  }

  // Update an existing inventory item
  updateItem(): void {
    this.clearManagementMessage();

    if (this.currentEditingItemName === '') {
      this.setManagementMessage('Load item first.', 'error');
      return;
    }

    const data = { ...this.updateForm };
    const errors = this.validateForm(data, true);

    if (errors.length > 0) {
      this.setManagementMessage(errors.join('<br>'), 'error');
      return;
    }

    const index = this.findIndexByName(this.currentEditingItemName);

    if (index === -1) {
      this.setManagementMessage('Original item could not be found.', 'error');
      return;
    }

    const duplicateNameIndex = this.inventory.findIndex(
      (item: InventoryItem): boolean =>
        this.normalise(item.itemName) === this.normalise(data.itemName) &&
        this.normalise(item.itemName) !== this.normalise(this.currentEditingItemName)
    );

    if (duplicateNameIndex !== -1) {
      this.setManagementMessage('Another item already uses this Item Name.', 'error');
      return;
    }

    const existingId = this.inventory[index].itemId;
    this.inventory[index] = this.toInventoryItem(data, existingId);
    this.currentEditingItemName = this.inventory[index].itemName;
    this.saveData();

    this.setManagementMessage(
      `Item <strong>${this.inventory[index].itemName}</strong> updated successfully.`,
      'success'
    );

    if (this.currentSection === 'inventory') {
      this.showAllItems();
    }
  }

  // Start the delete workflow by validating the selected item
  requestDelete(): void {
    this.clearManagementMessage();

    const name = this.deleteItemName.trim();

    if (name === '') {
      this.setManagementMessage('Enter the Item Name to delete an item.', 'error');
      return;
    }

    const item = this.findItemByName(name);

    if (!item) {
      this.setManagementMessage('Item not found.', 'error');
      return;
    }

    this.pendingDeleteName = item.itemName;
  }

  // Confirm and complete the delete operation
  confirmDelete(): void {
    const index = this.findIndexByName(this.pendingDeleteName);

    if (index === -1) {
      this.setManagementMessage('Delete failed. Item could not be found.', 'error');
      this.closeConfirmation();
      return;
    }

    const deletedName = this.inventory[index].itemName;
    this.inventory.splice(index, 1);
    this.saveData();
    this.clearDeleteForm();
    this.closeConfirmation();

    this.setManagementMessage(`Item <strong>${deletedName}</strong> deleted successfully.`, 'success');

    if (this.currentSection === 'inventory') {
      this.showAllItems();
    }
  }

  // Close the delete confirmation state
  closeConfirmation(): void {
    this.pendingDeleteName = '';
  }

  // Search items by item name keyword
  searchItem(): void {
    this.clearSearchMessage();

    const keyword = this.searchKeyword.trim();

    if (keyword === '') {
      this.setSearchMessage('Please enter an Item Name to search.', 'error');
      return;
    }

    const results = this.inventory.filter((item: InventoryItem): boolean =>
      item.itemName.toLowerCase().includes(keyword.toLowerCase())
    );

    this.searchResults = results;
    this.searchResultsInfo = `Search results: ${results.length} item(s) found for "${keyword}".`;

    if (results.length === 0) {
      this.setSearchMessage(`No items matched <strong>${keyword}</strong>.`, 'info');
    } else {
      this.setSearchMessage(`Search completed for <strong>${keyword}</strong>.`, 'success');
    }
  }

  // Clear search input and search results
  clearSearch(): void {
    this.searchKeyword = '';
    this.searchResults = [];
    this.searchResultsInfo = 'No search performed yet.';
    this.clearSearchMessage();
  }

  // Display all inventory items
  showAllItems(): void {
    this.clearInventoryMessage();
    this.displayedInventoryItems = [...this.inventory];
    this.inventoryResultsInfo = `Displaying all ${this.inventory.length} item(s).`;
  }

  // Display only popular inventory items
  showPopularItems(): void {
    this.clearInventoryMessage();

    const popularItems = this.inventory.filter(
      (item: InventoryItem): boolean => item.popularItem === 'Yes'
    );

    this.displayedInventoryItems = popularItems;
    this.inventoryResultsInfo = `Displaying ${popularItems.length} popular item(s).`;

    if (popularItems.length === 0) {
      this.setInventoryMessage('There are no popular items in the database.', 'info');
    }
  }

  // Return badge class name based on stock status
  getBadgeClass(status: StockStatus): string {
    if (status === 'In Stock') {
      return 'badge-green';
    }

    if (status === 'Low Stock') {
      return 'badge-yellow';
    }

    return 'badge-red';
  }

  // Total number of inventory records
  get totalItemCount(): number {
    return this.inventory.length;
  }

  // Total number of distinct categories
  get totalCategoryCount(): number {
    return new Set(this.inventory.map((item: InventoryItem) => item.category)).size;
  }

  // Total quantity of all items combined
  get totalQuantityCount(): number {
    return this.inventory.reduce((sum: number, item: InventoryItem) => sum + item.quantity, 0);
  }
}