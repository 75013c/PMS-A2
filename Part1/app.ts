// 24832452 HongyuLiu

// Type definitions for constrained field values
type Category = "Electronics" | "Furniture" | "Clothing" | "Tools" | "Miscellaneous";
type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";
type PopularItem = "Yes" | "No";

// Inventory item data model
interface InventoryItem {
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
interface FormDataShape {
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

// Session storage key for inventory persistence
const STORAGE_KEY = "inventory_session_data";

// Default inventory records loaded when no session data exists
const defaultInventory: InventoryItem[] = [
  {
    itemId: "E1001",
    itemName: "Smart TV",
    category: "Electronics",
    quantity: 12,
    price: 799.99,
    supplierName: "VisionTech",
    stockStatus: "In Stock",
    popularItem: "Yes",
    comment: "Top-selling 55 inch model"
  },
  {
    itemId: "F2001",
    itemName: "Office Chair",
    category: "Furniture",
    quantity: 4,
    price: 149.5,
    supplierName: "Comfort Seating",
    stockStatus: "Low Stock",
    popularItem: "No",
    comment: "Ergonomic design"
  },
  {
    itemId: "C3001",
    itemName: "Winter Jacket",
    category: "Clothing",
    quantity: 15,
    price: 89.99,
    supplierName: "UrbanWear",
    stockStatus: "In Stock",
    popularItem: "Yes",
    comment: "Water-resistant material"
  },
  {
    itemId: "T4001",
    itemName: "Cordless Drill",
    category: "Tools",
    quantity: 3,
    price: 129.99,
    supplierName: "BuildPro",
    stockStatus: "Low Stock",
    popularItem: "No",
    comment: "Includes battery and charger"
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

// Load inventory data from session storage or initialize with default data
function loadInventory(): InventoryItem[] {
  const saved: string | null = sessionStorage.getItem(STORAGE_KEY);

  if (saved) {
    return JSON.parse(saved) as InventoryItem[];
  }

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(defaultInventory));
  return [...defaultInventory];
}

// Global inventory state and temporary operation state
let inventory: InventoryItem[] = loadInventory();
let currentEditingItemName: string = "";
let pendingDeleteName: string = "";

// ---------- Navigation ----------
// Navigation links
const navManagement = document.getElementById("navManagement") as HTMLAnchorElement | null;
const navSearch = document.getElementById("navSearch") as HTMLAnchorElement | null;
const navInventory = document.getElementById("navInventory") as HTMLAnchorElement | null;

// Main page sections
const managementSection = document.getElementById("managementSection") as HTMLElement | null;
const searchSection = document.getElementById("searchSection") as HTMLElement | null;
const inventorySection = document.getElementById("inventorySection") as HTMLElement | null;

// Switch between main sections and update active navigation state
function switchSection(section: "management" | "search" | "inventory"): void {
  managementSection?.classList.add("hidden");
  searchSection?.classList.add("hidden");
  inventorySection?.classList.add("hidden");

  navManagement?.classList.remove("active");
  navSearch?.classList.remove("active");
  navInventory?.classList.remove("active");

  if (section === "management") {
    managementSection?.classList.remove("hidden");
    navManagement?.classList.add("active");
  } else if (section === "search") {
    searchSection?.classList.remove("hidden");
    navSearch?.classList.add("active");
  } else {
    inventorySection?.classList.remove("hidden");
    navInventory?.classList.add("active");
    showAllItems();
  }
}

// ---------- Global helpers ----------
// Save current inventory data to session storage
function saveData(): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
}

// Normalize strings for case-insensitive and trimmed comparisons
function normalise(name: string): string {
  return name.trim().toLowerCase();
}

// Find an inventory item by item name
function findItemByName(name: string): InventoryItem | undefined {
  return inventory.find((item: InventoryItem): boolean => normalise(item.itemName) === normalise(name));
}

// Find the index of an inventory item by item name
function findIndexByName(name: string): number {
  return inventory.findIndex((item: InventoryItem): boolean => normalise(item.itemName) === normalise(name));
}

// Return HTML badge markup for stock status
function getStockBadge(status: StockStatus): string {
  if (status === "In Stock") {
    return `<span class="badge badge-green">${status}</span>`;
  }

  if (status === "Low Stock") {
    return `<span class="badge badge-yellow">${status}</span>`;
  }

  return `<span class="badge badge-red">${status}</span>`;
}

// Render inventory items into a table body
function renderItems(items: InventoryItem[], tableBody: HTMLTableSectionElement | null): void {
  if (!tableBody) {
    return;
  }

  if (items.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="9" class="empty-state">No items found.</td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = items
    .map((item: InventoryItem): string => {
      return `
        <tr>
          <td>${item.itemId}</td>
          <td>${item.itemName}</td>
          <td>${item.category}</td>
          <td>${item.quantity}</td>
          <td>$${item.price.toFixed(2)}</td>
          <td>${item.supplierName}</td>
          <td>${getStockBadge(item.stockStatus)}</td>
          <td>${item.popularItem}</td>
          <td>${item.comment || "-"}</td>
        </tr>
      `;
    })
    .join("");
}

// Show a styled message in a message box
function showMessage(box: HTMLDivElement | null, message: string, type: "success" | "error" | "info"): void {
  if (!box) {
    return;
  }

  box.className = `message ${type}`;
  box.innerHTML = message;
}

// Clear message content and state
function clearMessage(box: HTMLDivElement | null): void {
  if (!box) {
    return;
  }

  box.className = "message";
  box.innerHTML = "";
}

// Update plain text result information
function updateResultsInfo(box: HTMLDivElement | null, text: string): void {
  if (!box) {
    return;
  }

  box.textContent = text;
}

// ==================================================
// MANAGEMENT SECTION
// ==================================================
// Message area for management operations
const managementMessageBox = document.getElementById("managementMessageBox") as HTMLDivElement | null;

// Management panels
const addPanel = document.getElementById("addPanel") as HTMLDivElement | null;
const updatePanel = document.getElementById("updatePanel") as HTMLDivElement | null;
const deletePanel = document.getElementById("deletePanel") as HTMLDivElement | null;

// Panel toggle buttons
const showAddPanelBtn = document.getElementById("showAddPanelBtn") as HTMLButtonElement | null;
const showUpdatePanelBtn = document.getElementById("showUpdatePanelBtn") as HTMLButtonElement | null;
const showDeletePanelBtn = document.getElementById("showDeletePanelBtn") as HTMLButtonElement | null;

// Add form inputs
const addItemIdInput = document.getElementById("addItemId") as HTMLInputElement | null;
const addItemNameInput = document.getElementById("addItemName") as HTMLInputElement | null;
const addCategoryInput = document.getElementById("addCategory") as HTMLSelectElement | null;
const addQuantityInput = document.getElementById("addQuantity") as HTMLInputElement | null;
const addPriceInput = document.getElementById("addPrice") as HTMLInputElement | null;
const addSupplierInput = document.getElementById("addSupplierName") as HTMLInputElement | null;
const addStockInput = document.getElementById("addStockStatus") as HTMLSelectElement | null;
const addPopularInput = document.getElementById("addPopularItem") as HTMLSelectElement | null;
const addCommentInput = document.getElementById("addComment") as HTMLTextAreaElement | null;

// Update form inputs
const loadItemNameInput = document.getElementById("loadItemName") as HTMLInputElement | null;
const updateItemIdInput = document.getElementById("updateItemId") as HTMLInputElement | null;
const updateItemNameInput = document.getElementById("updateItemName") as HTMLInputElement | null;
const updateCategoryInput = document.getElementById("updateCategory") as HTMLSelectElement | null;
const updateQuantityInput = document.getElementById("updateQuantity") as HTMLInputElement | null;
const updatePriceInput = document.getElementById("updatePrice") as HTMLInputElement | null;
const updateSupplierInput = document.getElementById("updateSupplierName") as HTMLInputElement | null;
const updateStockInput = document.getElementById("updateStockStatus") as HTMLSelectElement | null;
const updatePopularInput = document.getElementById("updatePopularItem") as HTMLSelectElement | null;
const updateCommentInput = document.getElementById("updateComment") as HTMLTextAreaElement | null;

// Delete form input
const deleteItemNameInput = document.getElementById("deleteItemName") as HTMLInputElement | null;

// Management buttons
const addBtn = document.getElementById("addBtn") as HTMLButtonElement | null;
const editBtn = document.getElementById("editBtn") as HTMLButtonElement | null;
const updateBtn = document.getElementById("updateBtn") as HTMLButtonElement | null;
const deleteBtn = document.getElementById("deleteBtn") as HTMLButtonElement | null;

const clearAddBtn = document.getElementById("clearAddBtn") as HTMLButtonElement | null;
const clearUpdateBtn = document.getElementById("clearUpdateBtn") as HTMLButtonElement | null;

// Delete confirmation elements
const confirmBox = document.getElementById("confirmBox") as HTMLDivElement | null;
const confirmText = document.getElementById("confirmText") as HTMLDivElement | null;
const confirmYesBtn = document.getElementById("confirmYesBtn") as HTMLButtonElement | null;
const confirmNoBtn = document.getElementById("confirmNoBtn") as HTMLButtonElement | null;

// Shared card that contains add / update / delete forms
const formCard = document.getElementById("formCard") as HTMLElement | null;

// Validate form data before add or update operations
function validateForm(data: FormDataShape, isUpdate: boolean = false): string[] {
  const errors: string[] = [];

  const itemId = String(data.itemId ?? "").trim();
  const itemName = String(data.itemName ?? "").trim();
  const category = String(data.category ?? "").trim();
  const quantityValue = String(data.quantity ?? "").trim();
  const priceValue = String(data.price ?? "").trim();
  const supplierName = String(data.supplierName ?? "").trim();
  const stockStatus = String(data.stockStatus ?? "").trim();
  const popularItem = String(data.popularItem ?? "").trim();

  if (!isUpdate && itemId === "") {
    errors.push("Item ID is required.");
  }

  if (itemName === "") {
    errors.push("Item Name is required.");
  }

  if (category === "") {
    errors.push("Category is required.");
  }

  if (quantityValue === "") {
    errors.push("Quantity is required.");
  } else {
    const quantityNumber = Number(quantityValue);

    if (!Number.isInteger(quantityNumber) || quantityNumber < 0) {
      errors.push("Quantity must be a whole number greater than or equal to 0.");
    }
  }

  if (priceValue === "") {
    errors.push("Price is required.");
  } else {
    const priceNumber = Number(priceValue);

    if (!Number.isFinite(priceNumber) || priceNumber < 0) {
      errors.push("Price must be a number greater than or equal to 0.");
    }
  }

  if (supplierName === "") {
    errors.push("Supplier Name is required.");
  }

  if (stockStatus === "") {
    errors.push("Stock Status is required.");
  }

  if (popularItem === "") {
    errors.push("Popular Item is required.");
  }

  return errors;
}

// Collect values from the add form
function getAddFormData(): FormDataShape {
  return {
    itemId: addItemIdInput?.value.trim() ?? "",
    itemName: addItemNameInput?.value.trim() ?? "",
    category: addCategoryInput?.value ?? "",
    quantity: addQuantityInput?.value.trim() ?? "",
    price: addPriceInput?.value.trim() ?? "",
    supplierName: addSupplierInput?.value.trim() ?? "",
    stockStatus: addStockInput?.value ?? "",
    popularItem: addPopularInput?.value ?? "",
    comment: addCommentInput?.value.trim() ?? ""
  };
}

// Collect values from the update form
function getUpdateFormData(): FormDataShape {
  return {
    itemId: updateItemIdInput?.value.trim() ?? "",
    itemName: updateItemNameInput?.value.trim() ?? "",
    category: updateCategoryInput?.value ?? "",
    quantity: updateQuantityInput?.value.trim() ?? "",
    price: updatePriceInput?.value.trim() ?? "",
    supplierName: updateSupplierInput?.value.trim() ?? "",
    stockStatus: updateStockInput?.value ?? "",
    popularItem: updatePopularInput?.value ?? "",
    comment: updateCommentInput?.value.trim() ?? ""
  };
}

// Convert form data into a typed inventory item object
function toInventoryItem(data: FormDataShape, existingId?: string): InventoryItem {
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

// Clear all fields in the add form
function clearAddForm(): void {
  if (addItemIdInput) addItemIdInput.value = "";
  if (addItemNameInput) addItemNameInput.value = "";
  if (addCategoryInput) addCategoryInput.value = "";
  if (addQuantityInput) addQuantityInput.value = "";
  if (addPriceInput) addPriceInput.value = "";
  if (addSupplierInput) addSupplierInput.value = "";
  if (addStockInput) addStockInput.value = "";
  if (addPopularInput) addPopularInput.value = "";
  if (addCommentInput) addCommentInput.value = "";
}

// Clear all fields in the update form
function clearUpdateForm(): void {
  if (loadItemNameInput) loadItemNameInput.value = "";
  if (updateItemIdInput) updateItemIdInput.value = "";
  if (updateItemNameInput) updateItemNameInput.value = "";
  if (updateCategoryInput) updateCategoryInput.value = "";
  if (updateQuantityInput) updateQuantityInput.value = "";
  if (updatePriceInput) updatePriceInput.value = "";
  if (updateSupplierInput) updateSupplierInput.value = "";
  if (updateStockInput) updateStockInput.value = "";
  if (updatePopularInput) updatePopularInput.value = "";
  if (updateCommentInput) updateCommentInput.value = "";
  currentEditingItemName = "";
}

// Clear the delete input field
function clearDeleteForm(): void {
  if (deleteItemNameInput) {
    deleteItemNameInput.value = "";
  }
}

// Show the selected management panel and update button state
function setPanel(type: "add" | "update" | "delete"): void {
  addPanel?.classList.add("hidden");
  updatePanel?.classList.add("hidden");
  deletePanel?.classList.add("hidden");

  showAddPanelBtn?.classList.remove("active-action");
  showUpdatePanelBtn?.classList.remove("active-action");
  showDeletePanelBtn?.classList.remove("active-action");

  formCard?.classList.remove("hidden");

  if (type === "add") {
    addPanel?.classList.remove("hidden");
    showAddPanelBtn?.classList.add("active-action");
  } else if (type === "update") {
    updatePanel?.classList.remove("hidden");
    showUpdatePanelBtn?.classList.add("active-action");
  } else {
    deletePanel?.classList.remove("hidden");
    showDeletePanelBtn?.classList.add("active-action");
  }

  clearMessage(managementMessageBox);
}

// Add a new item to the inventory
function addItem(): void {
  clearMessage(managementMessageBox);

  const data: FormDataShape = getAddFormData();
  const errors: string[] = validateForm(data);

  if (errors.length > 0) {
    showMessage(managementMessageBox, errors.join("<br>"), "error");
    return;
  }

  if (inventory.some((item: InventoryItem): boolean => item.itemId === data.itemId)) {
    showMessage(managementMessageBox, "Item ID must be unique. This Item ID already exists.", "error");
    return;
  }

  if (findItemByName(data.itemName)) {
    showMessage(managementMessageBox, "Item Name already exists. Please use a different Item Name.", "error");
    return;
  }

  inventory.push(toInventoryItem(data));
  saveData();
  clearAddForm();
  showMessage(managementMessageBox, `Item <strong>${data.itemName}</strong> added successfully.`, "success");
}

// Load an existing item into the update form
function loadItem(): void {
  clearMessage(managementMessageBox);

  const name: string = loadItemNameInput?.value.trim() ?? "";

  if (name === "") {
    showMessage(managementMessageBox, "Enter the Item Name first to load it for editing.", "error");
    return;
  }

  const item: InventoryItem | undefined = findItemByName(name);

  if (!item) {
    showMessage(managementMessageBox, "Item not found.", "error");
    return;
  }

  currentEditingItemName = item.itemName;

  if (updateItemIdInput) updateItemIdInput.value = item.itemId;
  if (updateItemNameInput) updateItemNameInput.value = item.itemName;
  if (updateCategoryInput) updateCategoryInput.value = item.category;
  if (updateQuantityInput) updateQuantityInput.value = item.quantity.toString();
  if (updatePriceInput) updatePriceInput.value = item.price.toString();
  if (updateSupplierInput) updateSupplierInput.value = item.supplierName;
  if (updateStockInput) updateStockInput.value = item.stockStatus;
  if (updatePopularInput) updatePopularInput.value = item.popularItem;
  if (updateCommentInput) updateCommentInput.value = item.comment;

  showMessage(managementMessageBox, `Item <strong>${item.itemName}</strong> loaded for editing.`, "info");
}

// Update an existing inventory item
function updateItem(): void {
  clearMessage(managementMessageBox);

  if (currentEditingItemName === "") {
    showMessage(managementMessageBox, "Load item first.", "error");
    return;
  }

  const data: FormDataShape = getUpdateFormData();
  const errors: string[] = validateForm(data, true);

  if (errors.length > 0) {
    showMessage(managementMessageBox, errors.join("<br>"), "error");
    return;
  }

  const index: number = findIndexByName(currentEditingItemName);

  if (index === -1) {
    showMessage(managementMessageBox, "Original item could not be found.", "error");
    return;
  }

  const duplicateNameIndex: number = inventory.findIndex(
    (item: InventoryItem): boolean =>
      normalise(item.itemName) === normalise(data.itemName) &&
      normalise(item.itemName) !== normalise(currentEditingItemName)
  );

  if (duplicateNameIndex !== -1) {
    showMessage(managementMessageBox, "Another item already uses this Item Name.", "error");
    return;
  }

  const existingId: string = inventory[index].itemId;
  inventory[index] = toInventoryItem(data, existingId);
  currentEditingItemName = inventory[index].itemName;
  saveData();

  showMessage(managementMessageBox, `Item <strong>${inventory[index].itemName}</strong> updated successfully.`, "success");
}

// Start the delete process by validating the selected item
function requestDelete(): void {
  clearMessage(managementMessageBox);

  const name: string = deleteItemNameInput?.value.trim() ?? "";

  if (name === "") {
    showMessage(managementMessageBox, "Enter the Item Name to delete an item.", "error");
    return;
  }

  const item: InventoryItem | undefined = findItemByName(name);

  if (!item) {
    showMessage(managementMessageBox, "Item not found.", "error");
    return;
  }

  pendingDeleteName = item.itemName;

  if (confirmText && confirmBox) {
    confirmText.innerHTML = `Are you sure you want to delete <strong>${item.itemName}</strong>?`;
    confirmBox.classList.remove("hidden");
  }
}

// Confirm and complete the delete operation
function confirmDelete(): void {
  const index: number = findIndexByName(pendingDeleteName);

  if (index === -1) {
    showMessage(managementMessageBox, "Delete failed. Item could not be found.", "error");
    closeConfirmation();
    return;
  }

  const deletedName: string = inventory[index].itemName;
  inventory.splice(index, 1);
  saveData();
  clearDeleteForm();
  closeConfirmation();
  showMessage(managementMessageBox, `Item <strong>${deletedName}</strong> deleted successfully.`, "success");
}

// Close the delete confirmation dialog
function closeConfirmation(): void {
  pendingDeleteName = "";

  if (confirmBox) {
    confirmBox.classList.add("hidden");
  }

  if (confirmText) {
    confirmText.innerHTML = "";
  }
}

// Set up management section event listeners
function initializeManagementSection(): void {
  showAddPanelBtn?.addEventListener("click", (): void => setPanel("add"));
  showUpdatePanelBtn?.addEventListener("click", (): void => setPanel("update"));
  showDeletePanelBtn?.addEventListener("click", (): void => setPanel("delete"));

  addBtn?.addEventListener("click", addItem);
  editBtn?.addEventListener("click", loadItem);
  updateBtn?.addEventListener("click", updateItem);
  deleteBtn?.addEventListener("click", requestDelete);

  clearAddBtn?.addEventListener("click", (): void => {
    clearAddForm();
    clearMessage(managementMessageBox);
  });

  clearUpdateBtn?.addEventListener("click", (): void => {
    clearUpdateForm();
    clearMessage(managementMessageBox);
  });

  confirmYesBtn?.addEventListener("click", confirmDelete);
  confirmNoBtn?.addEventListener("click", closeConfirmation);

  clearMessage(managementMessageBox);
}

// ==================================================
// SEARCH SECTION
// ==================================================
// Search section elements
const searchMessageBox = document.getElementById("searchMessageBox") as HTMLDivElement | null;
const searchResultsInfo = document.getElementById("searchResultsInfo") as HTMLDivElement | null;
const searchTableBody = document.getElementById("searchTableBody") as HTMLTableSectionElement | null;

const searchNameInput = document.getElementById("searchName") as HTMLInputElement | null;
const searchBtn = document.getElementById("searchBtn") as HTMLButtonElement | null;
const clearSearchBtn = document.getElementById("clearSearchBtn") as HTMLButtonElement | null;

// Search items by item name keyword
function searchItem(): void {
  clearMessage(searchMessageBox);

  const keyword: string = searchNameInput?.value.trim() ?? "";

  if (keyword === "") {
    showMessage(searchMessageBox, "Please enter an Item Name to search.", "error");
    return;
  }

  const results: InventoryItem[] = inventory.filter((item: InventoryItem): boolean =>
    item.itemName.toLowerCase().includes(keyword.toLowerCase())
  );

  renderItems(results, searchTableBody);
  updateResultsInfo(searchResultsInfo, `Search results: ${results.length} item(s) found for "${keyword}".`);

  if (results.length === 0) {
    showMessage(searchMessageBox, `No items matched <strong>${keyword}</strong>.`, "info");
  } else {
    showMessage(searchMessageBox, `Search completed for <strong>${keyword}</strong>.`, "success");
  }
}

// Clear search input and search results
function clearSearch(): void {
  if (searchNameInput) {
    searchNameInput.value = "";
  }

  clearMessage(searchMessageBox);
  renderItems([], searchTableBody);
  updateResultsInfo(searchResultsInfo, "No search performed yet.");
}

// Set up search section event listeners
function initializeSearchSection(): void {
  searchBtn?.addEventListener("click", searchItem);
  clearSearchBtn?.addEventListener("click", clearSearch);

  renderItems([], searchTableBody);
  updateResultsInfo(searchResultsInfo, "No search performed yet.");
}

// ==================================================
// INVENTORY SECTION
// ==================================================
// Inventory section elements
const inventoryMessageBox = document.getElementById("inventoryMessageBox") as HTMLDivElement | null;
const inventoryResultsInfo = document.getElementById("inventoryResultsInfo") as HTMLDivElement | null;
const inventoryTableBody = document.getElementById("inventoryTableBody") as HTMLTableSectionElement | null;

const showAllBtn = document.getElementById("showAllBtn") as HTMLButtonElement | null;
const showPopularBtn = document.getElementById("showPopularBtn") as HTMLButtonElement | null;

// Show all inventory items
function showAllItems(): void {
  clearMessage(inventoryMessageBox);
  renderItems(inventory, inventoryTableBody);
  updateResultsInfo(inventoryResultsInfo, `Displaying all ${inventory.length} item(s).`);
}

// Show only popular items
function showPopularItems(): void {
  clearMessage(inventoryMessageBox);

  const popularItems: InventoryItem[] = inventory.filter(
    (item: InventoryItem): boolean => item.popularItem === "Yes"
  );

  renderItems(popularItems, inventoryTableBody);
  updateResultsInfo(inventoryResultsInfo, `Displaying ${popularItems.length} popular item(s).`);

  if (popularItems.length === 0) {
    showMessage(inventoryMessageBox, "There are no popular items in the database.", "info");
  }
}

// Set up inventory section event listeners
function initializeInventorySection(): void {
  showAllBtn?.addEventListener("click", showAllItems);
  showPopularBtn?.addEventListener("click", showPopularItems);

  showAllItems();
}

// ==================================================
// APP START
// ==================================================
// Set up navigation event listeners
function initializeNavigation(): void {
  navManagement?.addEventListener("click", (event: MouseEvent): void => {
    event.preventDefault();
    switchSection("management");
  });

  navSearch?.addEventListener("click", (event: MouseEvent): void => {
    event.preventDefault();
    switchSection("search");
  });

  navInventory?.addEventListener("click", (event: MouseEvent): void => {
    event.preventDefault();
    switchSection("inventory");
  });
}

// Initialize all sections and show the default section
initializeManagementSection();
initializeSearchSection();
initializeInventorySection();
initializeNavigation();
switchSection("management");