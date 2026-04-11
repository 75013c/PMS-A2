// 24832452 HongyuLiu

"use strict";
// 24832452 HongyuLiu
// Session storage key for inventory persistence
const STORAGE_KEY = "inventory_session_data";
// Default inventory records loaded when no session data exists
const defaultInventory = [
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
function loadInventory() {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
        return JSON.parse(saved);
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(defaultInventory));
    return [...defaultInventory];
}
// Global inventory state and temporary operation state
let inventory = loadInventory();
let currentEditingItemName = "";
let pendingDeleteName = "";
// ---------- Navigation ----------
// Navigation links
const navManagement = document.getElementById("navManagement");
const navSearch = document.getElementById("navSearch");
const navInventory = document.getElementById("navInventory");
// Main page sections
const managementSection = document.getElementById("managementSection");
const searchSection = document.getElementById("searchSection");
const inventorySection = document.getElementById("inventorySection");
// Switch between main sections and update active navigation state
function switchSection(section) {
    managementSection === null || managementSection === void 0 ? void 0 : managementSection.classList.add("hidden");
    searchSection === null || searchSection === void 0 ? void 0 : searchSection.classList.add("hidden");
    inventorySection === null || inventorySection === void 0 ? void 0 : inventorySection.classList.add("hidden");
    navManagement === null || navManagement === void 0 ? void 0 : navManagement.classList.remove("active");
    navSearch === null || navSearch === void 0 ? void 0 : navSearch.classList.remove("active");
    navInventory === null || navInventory === void 0 ? void 0 : navInventory.classList.remove("active");
    if (section === "management") {
        managementSection === null || managementSection === void 0 ? void 0 : managementSection.classList.remove("hidden");
        navManagement === null || navManagement === void 0 ? void 0 : navManagement.classList.add("active");
    }
    else if (section === "search") {
        searchSection === null || searchSection === void 0 ? void 0 : searchSection.classList.remove("hidden");
        navSearch === null || navSearch === void 0 ? void 0 : navSearch.classList.add("active");
    }
    else {
        inventorySection === null || inventorySection === void 0 ? void 0 : inventorySection.classList.remove("hidden");
        navInventory === null || navInventory === void 0 ? void 0 : navInventory.classList.add("active");
        showAllItems();
    }
}
// ---------- Global helpers ----------
// Save current inventory data to session storage
function saveData() {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
}
// Normalize strings for case-insensitive and trimmed comparisons
function normalise(name) {
    return name.trim().toLowerCase();
}
// Find an inventory item by item name
function findItemByName(name) {
    return inventory.find((item) => normalise(item.itemName) === normalise(name));
}
// Find the index of an inventory item by item name
function findIndexByName(name) {
    return inventory.findIndex((item) => normalise(item.itemName) === normalise(name));
}
// Return HTML badge markup for stock status
function getStockBadge(status) {
    if (status === "In Stock") {
        return `<span class="badge badge-green">${status}</span>`;
    }
    if (status === "Low Stock") {
        return `<span class="badge badge-yellow">${status}</span>`;
    }
    return `<span class="badge badge-red">${status}</span>`;
}
// Render inventory items into a table body
function renderItems(items, tableBody) {
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
        .map((item) => {
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
function showMessage(box, message, type) {
    if (!box) {
        return;
    }
    box.className = `message ${type}`;
    box.innerHTML = message;
}
// Clear message content and state
function clearMessage(box) {
    if (!box) {
        return;
    }
    box.className = "message";
    box.innerHTML = "";
}
// Update plain text result information
function updateResultsInfo(box, text) {
    if (!box) {
        return;
    }
    box.textContent = text;
}
// ==================================================
// MANAGEMENT SECTION
// ==================================================
// Message area for management operations
const managementMessageBox = document.getElementById("managementMessageBox");
// Management panels
const addPanel = document.getElementById("addPanel");
const updatePanel = document.getElementById("updatePanel");
const deletePanel = document.getElementById("deletePanel");
// Panel toggle buttons
const showAddPanelBtn = document.getElementById("showAddPanelBtn");
const showUpdatePanelBtn = document.getElementById("showUpdatePanelBtn");
const showDeletePanelBtn = document.getElementById("showDeletePanelBtn");
// Add form inputs
const addItemIdInput = document.getElementById("addItemId");
const addItemNameInput = document.getElementById("addItemName");
const addCategoryInput = document.getElementById("addCategory");
const addQuantityInput = document.getElementById("addQuantity");
const addPriceInput = document.getElementById("addPrice");
const addSupplierInput = document.getElementById("addSupplierName");
const addStockInput = document.getElementById("addStockStatus");
const addPopularInput = document.getElementById("addPopularItem");
const addCommentInput = document.getElementById("addComment");
// Update form inputs
const loadItemNameInput = document.getElementById("loadItemName");
const updateItemIdInput = document.getElementById("updateItemId");
const updateItemNameInput = document.getElementById("updateItemName");
const updateCategoryInput = document.getElementById("updateCategory");
const updateQuantityInput = document.getElementById("updateQuantity");
const updatePriceInput = document.getElementById("updatePrice");
const updateSupplierInput = document.getElementById("updateSupplierName");
const updateStockInput = document.getElementById("updateStockStatus");
const updatePopularInput = document.getElementById("updatePopularItem");
const updateCommentInput = document.getElementById("updateComment");
// Delete form input
const deleteItemNameInput = document.getElementById("deleteItemName");
// Management buttons
const addBtn = document.getElementById("addBtn");
const editBtn = document.getElementById("editBtn");
const updateBtn = document.getElementById("updateBtn");
const deleteBtn = document.getElementById("deleteBtn");
const clearAddBtn = document.getElementById("clearAddBtn");
const clearUpdateBtn = document.getElementById("clearUpdateBtn");
// Delete confirmation elements
const confirmBox = document.getElementById("confirmBox");
const confirmText = document.getElementById("confirmText");
const confirmYesBtn = document.getElementById("confirmYesBtn");
const confirmNoBtn = document.getElementById("confirmNoBtn");
// Shared card that contains add / update / delete forms
const formCard = document.getElementById("formCard");
// Validate form data before add or update operations
function validateForm(data, isUpdate = false) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const errors = [];
    const itemId = String((_a = data.itemId) !== null && _a !== void 0 ? _a : "").trim();
    const itemName = String((_b = data.itemName) !== null && _b !== void 0 ? _b : "").trim();
    const category = String((_c = data.category) !== null && _c !== void 0 ? _c : "").trim();
    const quantityValue = String((_d = data.quantity) !== null && _d !== void 0 ? _d : "").trim();
    const priceValue = String((_e = data.price) !== null && _e !== void 0 ? _e : "").trim();
    const supplierName = String((_f = data.supplierName) !== null && _f !== void 0 ? _f : "").trim();
    const stockStatus = String((_g = data.stockStatus) !== null && _g !== void 0 ? _g : "").trim();
    const popularItem = String((_h = data.popularItem) !== null && _h !== void 0 ? _h : "").trim();
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
    }
    else {
        const quantityNumber = Number(quantityValue);
        if (!Number.isInteger(quantityNumber) || quantityNumber < 0) {
            errors.push("Quantity must be a whole number greater than or equal to 0.");
        }
    }
    if (priceValue === "") {
        errors.push("Price is required.");
    }
    else {
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
function getAddFormData() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return {
        itemId: (_a = addItemIdInput === null || addItemIdInput === void 0 ? void 0 : addItemIdInput.value.trim()) !== null && _a !== void 0 ? _a : "",
        itemName: (_b = addItemNameInput === null || addItemNameInput === void 0 ? void 0 : addItemNameInput.value.trim()) !== null && _b !== void 0 ? _b : "",
        category: (_c = addCategoryInput === null || addCategoryInput === void 0 ? void 0 : addCategoryInput.value) !== null && _c !== void 0 ? _c : "",
        quantity: (_d = addQuantityInput === null || addQuantityInput === void 0 ? void 0 : addQuantityInput.value.trim()) !== null && _d !== void 0 ? _d : "",
        price: (_e = addPriceInput === null || addPriceInput === void 0 ? void 0 : addPriceInput.value.trim()) !== null && _e !== void 0 ? _e : "",
        supplierName: (_f = addSupplierInput === null || addSupplierInput === void 0 ? void 0 : addSupplierInput.value.trim()) !== null && _f !== void 0 ? _f : "",
        stockStatus: (_g = addStockInput === null || addStockInput === void 0 ? void 0 : addStockInput.value) !== null && _g !== void 0 ? _g : "",
        popularItem: (_h = addPopularInput === null || addPopularInput === void 0 ? void 0 : addPopularInput.value) !== null && _h !== void 0 ? _h : "",
        comment: (_j = addCommentInput === null || addCommentInput === void 0 ? void 0 : addCommentInput.value.trim()) !== null && _j !== void 0 ? _j : ""
    };
}
// Collect values from the update form
function getUpdateFormData() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return {
        itemId: (_a = updateItemIdInput === null || updateItemIdInput === void 0 ? void 0 : updateItemIdInput.value.trim()) !== null && _a !== void 0 ? _a : "",
        itemName: (_b = updateItemNameInput === null || updateItemNameInput === void 0 ? void 0 : updateItemNameInput.value.trim()) !== null && _b !== void 0 ? _b : "",
        category: (_c = updateCategoryInput === null || updateCategoryInput === void 0 ? void 0 : updateCategoryInput.value) !== null && _c !== void 0 ? _c : "",
        quantity: (_d = updateQuantityInput === null || updateQuantityInput === void 0 ? void 0 : updateQuantityInput.value.trim()) !== null && _d !== void 0 ? _d : "",
        price: (_e = updatePriceInput === null || updatePriceInput === void 0 ? void 0 : updatePriceInput.value.trim()) !== null && _e !== void 0 ? _e : "",
        supplierName: (_f = updateSupplierInput === null || updateSupplierInput === void 0 ? void 0 : updateSupplierInput.value.trim()) !== null && _f !== void 0 ? _f : "",
        stockStatus: (_g = updateStockInput === null || updateStockInput === void 0 ? void 0 : updateStockInput.value) !== null && _g !== void 0 ? _g : "",
        popularItem: (_h = updatePopularInput === null || updatePopularInput === void 0 ? void 0 : updatePopularInput.value) !== null && _h !== void 0 ? _h : "",
        comment: (_j = updateCommentInput === null || updateCommentInput === void 0 ? void 0 : updateCommentInput.value.trim()) !== null && _j !== void 0 ? _j : ""
    };
}
// Convert form data into a typed inventory item object
function toInventoryItem(data, existingId) {
    return {
        itemId: existingId !== null && existingId !== void 0 ? existingId : data.itemId,
        itemName: data.itemName,
        category: data.category,
        quantity: Number(data.quantity),
        price: Number(data.price),
        supplierName: data.supplierName,
        stockStatus: data.stockStatus,
        popularItem: data.popularItem,
        comment: data.comment
    };
}
// Clear all fields in the add form
function clearAddForm() {
    if (addItemIdInput)
        addItemIdInput.value = "";
    if (addItemNameInput)
        addItemNameInput.value = "";
    if (addCategoryInput)
        addCategoryInput.value = "";
    if (addQuantityInput)
        addQuantityInput.value = "";
    if (addPriceInput)
        addPriceInput.value = "";
    if (addSupplierInput)
        addSupplierInput.value = "";
    if (addStockInput)
        addStockInput.value = "";
    if (addPopularInput)
        addPopularInput.value = "";
    if (addCommentInput)
        addCommentInput.value = "";
}
// Clear all fields in the update form
function clearUpdateForm() {
    if (loadItemNameInput)
        loadItemNameInput.value = "";
    if (updateItemIdInput)
        updateItemIdInput.value = "";
    if (updateItemNameInput)
        updateItemNameInput.value = "";
    if (updateCategoryInput)
        updateCategoryInput.value = "";
    if (updateQuantityInput)
        updateQuantityInput.value = "";
    if (updatePriceInput)
        updatePriceInput.value = "";
    if (updateSupplierInput)
        updateSupplierInput.value = "";
    if (updateStockInput)
        updateStockInput.value = "";
    if (updatePopularInput)
        updatePopularInput.value = "";
    if (updateCommentInput)
        updateCommentInput.value = "";
    currentEditingItemName = "";
}
// Clear the delete input field
function clearDeleteForm() {
    if (deleteItemNameInput) {
        deleteItemNameInput.value = "";
    }
}
// Show the selected management panel and update button state
function setPanel(type) {
    addPanel === null || addPanel === void 0 ? void 0 : addPanel.classList.add("hidden");
    updatePanel === null || updatePanel === void 0 ? void 0 : updatePanel.classList.add("hidden");
    deletePanel === null || deletePanel === void 0 ? void 0 : deletePanel.classList.add("hidden");
    showAddPanelBtn === null || showAddPanelBtn === void 0 ? void 0 : showAddPanelBtn.classList.remove("active-action");
    showUpdatePanelBtn === null || showUpdatePanelBtn === void 0 ? void 0 : showUpdatePanelBtn.classList.remove("active-action");
    showDeletePanelBtn === null || showDeletePanelBtn === void 0 ? void 0 : showDeletePanelBtn.classList.remove("active-action");
    formCard === null || formCard === void 0 ? void 0 : formCard.classList.remove("hidden");
    if (type === "add") {
        addPanel === null || addPanel === void 0 ? void 0 : addPanel.classList.remove("hidden");
        showAddPanelBtn === null || showAddPanelBtn === void 0 ? void 0 : showAddPanelBtn.classList.add("active-action");
    }
    else if (type === "update") {
        updatePanel === null || updatePanel === void 0 ? void 0 : updatePanel.classList.remove("hidden");
        showUpdatePanelBtn === null || showUpdatePanelBtn === void 0 ? void 0 : showUpdatePanelBtn.classList.add("active-action");
    }
    else {
        deletePanel === null || deletePanel === void 0 ? void 0 : deletePanel.classList.remove("hidden");
        showDeletePanelBtn === null || showDeletePanelBtn === void 0 ? void 0 : showDeletePanelBtn.classList.add("active-action");
    }
    clearMessage(managementMessageBox);
}
// Add a new item to the inventory
function addItem() {
    clearMessage(managementMessageBox);
    const data = getAddFormData();
    const errors = validateForm(data);
    if (errors.length > 0) {
        showMessage(managementMessageBox, errors.join("<br>"), "error");
        return;
    }
    if (inventory.some((item) => item.itemId === data.itemId)) {
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
function loadItem() {
    var _a;
    clearMessage(managementMessageBox);
    const name = (_a = loadItemNameInput === null || loadItemNameInput === void 0 ? void 0 : loadItemNameInput.value.trim()) !== null && _a !== void 0 ? _a : "";
    if (name === "") {
        showMessage(managementMessageBox, "Enter the Item Name first to load it for editing.", "error");
        return;
    }
    const item = findItemByName(name);
    if (!item) {
        showMessage(managementMessageBox, "Item not found.", "error");
        return;
    }
    currentEditingItemName = item.itemName;
    if (updateItemIdInput)
        updateItemIdInput.value = item.itemId;
    if (updateItemNameInput)
        updateItemNameInput.value = item.itemName;
    if (updateCategoryInput)
        updateCategoryInput.value = item.category;
    if (updateQuantityInput)
        updateQuantityInput.value = item.quantity.toString();
    if (updatePriceInput)
        updatePriceInput.value = item.price.toString();
    if (updateSupplierInput)
        updateSupplierInput.value = item.supplierName;
    if (updateStockInput)
        updateStockInput.value = item.stockStatus;
    if (updatePopularInput)
        updatePopularInput.value = item.popularItem;
    if (updateCommentInput)
        updateCommentInput.value = item.comment;
    showMessage(managementMessageBox, `Item <strong>${item.itemName}</strong> loaded for editing.`, "info");
}
// Update an existing inventory item
function updateItem() {
    clearMessage(managementMessageBox);
    if (currentEditingItemName === "") {
        showMessage(managementMessageBox, "Load item first.", "error");
        return;
    }
    const data = getUpdateFormData();
    const errors = validateForm(data, true);
    if (errors.length > 0) {
        showMessage(managementMessageBox, errors.join("<br>"), "error");
        return;
    }
    const index = findIndexByName(currentEditingItemName);
    if (index === -1) {
        showMessage(managementMessageBox, "Original item could not be found.", "error");
        return;
    }
    const duplicateNameIndex = inventory.findIndex((item) => normalise(item.itemName) === normalise(data.itemName) &&
        normalise(item.itemName) !== normalise(currentEditingItemName));
    if (duplicateNameIndex !== -1) {
        showMessage(managementMessageBox, "Another item already uses this Item Name.", "error");
        return;
    }
    const existingId = inventory[index].itemId;
    inventory[index] = toInventoryItem(data, existingId);
    currentEditingItemName = inventory[index].itemName;
    saveData();
    showMessage(managementMessageBox, `Item <strong>${inventory[index].itemName}</strong> updated successfully.`, "success");
}
// Start the delete process by validating the selected item
function requestDelete() {
    var _a;
    clearMessage(managementMessageBox);
    const name = (_a = deleteItemNameInput === null || deleteItemNameInput === void 0 ? void 0 : deleteItemNameInput.value.trim()) !== null && _a !== void 0 ? _a : "";
    if (name === "") {
        showMessage(managementMessageBox, "Enter the Item Name to delete an item.", "error");
        return;
    }
    const item = findItemByName(name);
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
function confirmDelete() {
    const index = findIndexByName(pendingDeleteName);
    if (index === -1) {
        showMessage(managementMessageBox, "Delete failed. Item could not be found.", "error");
        closeConfirmation();
        return;
    }
    const deletedName = inventory[index].itemName;
    inventory.splice(index, 1);
    saveData();
    clearDeleteForm();
    closeConfirmation();
    showMessage(managementMessageBox, `Item <strong>${deletedName}</strong> deleted successfully.`, "success");
}
// Close the delete confirmation dialog
function closeConfirmation() {
    pendingDeleteName = "";
    if (confirmBox) {
        confirmBox.classList.add("hidden");
    }
    if (confirmText) {
        confirmText.innerHTML = "";
    }
}
// Set up management section event listeners
function initializeManagementSection() {
    showAddPanelBtn === null || showAddPanelBtn === void 0 ? void 0 : showAddPanelBtn.addEventListener("click", () => setPanel("add"));
    showUpdatePanelBtn === null || showUpdatePanelBtn === void 0 ? void 0 : showUpdatePanelBtn.addEventListener("click", () => setPanel("update"));
    showDeletePanelBtn === null || showDeletePanelBtn === void 0 ? void 0 : showDeletePanelBtn.addEventListener("click", () => setPanel("delete"));
    addBtn === null || addBtn === void 0 ? void 0 : addBtn.addEventListener("click", addItem);
    editBtn === null || editBtn === void 0 ? void 0 : editBtn.addEventListener("click", loadItem);
    updateBtn === null || updateBtn === void 0 ? void 0 : updateBtn.addEventListener("click", updateItem);
    deleteBtn === null || deleteBtn === void 0 ? void 0 : deleteBtn.addEventListener("click", requestDelete);
    clearAddBtn === null || clearAddBtn === void 0 ? void 0 : clearAddBtn.addEventListener("click", () => {
        clearAddForm();
        clearMessage(managementMessageBox);
    });
    clearUpdateBtn === null || clearUpdateBtn === void 0 ? void 0 : clearUpdateBtn.addEventListener("click", () => {
        clearUpdateForm();
        clearMessage(managementMessageBox);
    });
    confirmYesBtn === null || confirmYesBtn === void 0 ? void 0 : confirmYesBtn.addEventListener("click", confirmDelete);
    confirmNoBtn === null || confirmNoBtn === void 0 ? void 0 : confirmNoBtn.addEventListener("click", closeConfirmation);
    clearMessage(managementMessageBox);
}
// ==================================================
// SEARCH SECTION
// ==================================================
// Search section elements
const searchMessageBox = document.getElementById("searchMessageBox");
const searchResultsInfo = document.getElementById("searchResultsInfo");
const searchTableBody = document.getElementById("searchTableBody");
const searchNameInput = document.getElementById("searchName");
const searchBtn = document.getElementById("searchBtn");
const clearSearchBtn = document.getElementById("clearSearchBtn");
// Search items by item name keyword
function searchItem() {
    var _a;
    clearMessage(searchMessageBox);
    const keyword = (_a = searchNameInput === null || searchNameInput === void 0 ? void 0 : searchNameInput.value.trim()) !== null && _a !== void 0 ? _a : "";
    if (keyword === "") {
        showMessage(searchMessageBox, "Please enter an Item Name to search.", "error");
        return;
    }
    const results = inventory.filter((item) => item.itemName.toLowerCase().includes(keyword.toLowerCase()));
    renderItems(results, searchTableBody);
    updateResultsInfo(searchResultsInfo, `Search results: ${results.length} item(s) found for "${keyword}".`);
    if (results.length === 0) {
        showMessage(searchMessageBox, `No items matched <strong>${keyword}</strong>.`, "info");
    }
    else {
        showMessage(searchMessageBox, `Search completed for <strong>${keyword}</strong>.`, "success");
    }
}
// Clear search input and search results
function clearSearch() {
    if (searchNameInput) {
        searchNameInput.value = "";
    }
    clearMessage(searchMessageBox);
    renderItems([], searchTableBody);
    updateResultsInfo(searchResultsInfo, "No search performed yet.");
}
// Set up search section event listeners
function initializeSearchSection() {
    searchBtn === null || searchBtn === void 0 ? void 0 : searchBtn.addEventListener("click", searchItem);
    clearSearchBtn === null || clearSearchBtn === void 0 ? void 0 : clearSearchBtn.addEventListener("click", clearSearch);
    renderItems([], searchTableBody);
    updateResultsInfo(searchResultsInfo, "No search performed yet.");
}
// ==================================================
// INVENTORY SECTION
// ==================================================
// Inventory section elements
const inventoryMessageBox = document.getElementById("inventoryMessageBox");
const inventoryResultsInfo = document.getElementById("inventoryResultsInfo");
const inventoryTableBody = document.getElementById("inventoryTableBody");
const showAllBtn = document.getElementById("showAllBtn");
const showPopularBtn = document.getElementById("showPopularBtn");
// Show all inventory items
function showAllItems() {
    clearMessage(inventoryMessageBox);
    renderItems(inventory, inventoryTableBody);
    updateResultsInfo(inventoryResultsInfo, `Displaying all ${inventory.length} item(s).`);
}
// Show only popular items
function showPopularItems() {
    clearMessage(inventoryMessageBox);
    const popularItems = inventory.filter((item) => item.popularItem === "Yes");
    renderItems(popularItems, inventoryTableBody);
    updateResultsInfo(inventoryResultsInfo, `Displaying ${popularItems.length} popular item(s).`);
    if (popularItems.length === 0) {
        showMessage(inventoryMessageBox, "There are no popular items in the database.", "info");
    }
}
// Set up inventory section event listeners
function initializeInventorySection() {
    showAllBtn === null || showAllBtn === void 0 ? void 0 : showAllBtn.addEventListener("click", showAllItems);
    showPopularBtn === null || showPopularBtn === void 0 ? void 0 : showPopularBtn.addEventListener("click", showPopularItems);
    showAllItems();
}
// ==================================================
// APP START
// ==================================================
// Set up navigation event listeners
function initializeNavigation() {
    navManagement === null || navManagement === void 0 ? void 0 : navManagement.addEventListener("click", (event) => {
        event.preventDefault();
        switchSection("management");
    });
    navSearch === null || navSearch === void 0 ? void 0 : navSearch.addEventListener("click", (event) => {
        event.preventDefault();
        switchSection("search");
    });
    navInventory === null || navInventory === void 0 ? void 0 : navInventory.addEventListener("click", (event) => {
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
