"use strict";
// ============================
// Type Definitions
// ============================
// ============================
// Inventory Data
// ============================
const inventory = [
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
    }
];
// ============================
// DOM References
// ============================
const itemIdInput = document.getElementById("itemId");
const itemNameInput = document.getElementById("itemName");
const categoryInput = document.getElementById("category");
const quantityInput = document.getElementById("quantity");
const priceInput = document.getElementById("price");
const supplierNameInput = document.getElementById("supplierName");
const stockStatusInput = document.getElementById("stockStatus");
const popularItemInput = document.getElementById("popularItem");
const commentInput = document.getElementById("comment");
const searchNameInput = document.getElementById("searchName");
const messageBox = document.getElementById("messageBox");
const inventoryTableBody = document.getElementById("inventoryTableBody");
const resultsInfo = document.getElementById("resultsInfo");
const addBtn = document.getElementById("addBtn");
const editBtn = document.getElementById("editBtn");
const updateBtn = document.getElementById("updateBtn");
const deleteBtn = document.getElementById("deleteBtn");
const clearBtn = document.getElementById("clearBtn");
const searchBtn = document.getElementById("searchBtn");
const showAllBtn = document.getElementById("showAllBtn");
const showPopularBtn = document.getElementById("showPopularBtn");
const confirmBox = document.getElementById("confirmBox");
const confirmText = document.getElementById("confirmText");
const confirmYesBtn = document.getElementById("confirmYesBtn");
const confirmNoBtn = document.getElementById("confirmNoBtn");
// ============================
// Utility Functions
// ============================
function showMessage(message, type) {
    messageBox.className = `message ${type}`;
    messageBox.innerHTML = message;
}
function clearMessage() {
    messageBox.className = "message";
    messageBox.innerHTML = "";
}
function normaliseName(name) {
    return name.trim().toLowerCase();
}
function getFormData() {
    return {
        itemId: itemIdInput.value.trim(),
        itemName: itemNameInput.value.trim(),
        category: categoryInput.value,
        quantity: quantityInput.value.trim(),
        price: priceInput.value.trim(),
        supplierName: supplierNameInput.value.trim(),
        stockStatus: stockStatusInput.value,
        popularItem: popularItemInput.value,
        comment: commentInput.value.trim()
    };
}
function validateForm(data, isUpdate = false) {
    const errors = [];
    if (!isUpdate && data.itemId === "") {
        errors.push("Item ID is required.");
    }
    if (data.itemName === "") {
        errors.push("Item Name is required.");
    }
    if (data.category === "") {
        errors.push("Category is required.");
    }
    if (data.quantity === "") {
        errors.push("Quantity is required.");
    }
    else if (Number.isNaN(Number(data.quantity)) || Number(data.quantity) < 0) {
        errors.push("Quantity must be a number greater than or equal to 0.");
    }
    if (data.price === "") {
        errors.push("Price is required.");
    }
    else if (Number.isNaN(Number(data.price)) || Number(data.price) < 0) {
        errors.push("Price must be a number greater than or equal to 0.");
    }
    if (data.supplierName === "") {
        errors.push("Supplier Name is required.");
    }
    if (data.stockStatus === "") {
        errors.push("Stock Status is required.");
    }
    if (data.popularItem === "") {
        errors.push("Popular Item is required.");
    }
    return errors;
}
function isDuplicateItemId(itemId) {
    return inventory.some((item) => item.itemId === itemId);
}
function findItemByName(itemName) {
    return inventory.find((item) => normaliseName(item.itemName) === normaliseName(itemName));
}
function findItemIndexByName(itemName) {
    return inventory.findIndex((item) => normaliseName(item.itemName) === normaliseName(itemName));
}
function getStockBadge(status) {
    if (status === "In Stock") {
        return `<span class="badge badge-green">${status}</span>`;
    }
    if (status === "Low Stock") {
        return `<span class="badge badge-yellow">${status}</span>`;
    }
    return `<span class="badge badge-red">${status}</span>`;
}
function clearForm() {
    itemIdInput.value = "";
    itemNameInput.value = "";
    categoryInput.value = "";
    quantityInput.value = "";
    priceInput.value = "";
    supplierNameInput.value = "";
    stockStatusInput.value = "";
    popularItemInput.value = "";
    commentInput.value = "";
}
function fillForm(item) {
    itemIdInput.value = item.itemId;
    itemNameInput.value = item.itemName;
    categoryInput.value = item.category;
    quantityInput.value = item.quantity.toString();
    priceInput.value = item.price.toString();
    supplierNameInput.value = item.supplierName;
    stockStatusInput.value = item.stockStatus;
    popularItemInput.value = item.popularItem;
    commentInput.value = item.comment;
}
function renderItems(items) {
    if (items.length === 0) {
        inventoryTableBody.innerHTML = `
      <tr>
        <td colspan="9">No items found.</td>
      </tr>
    `;
        return;
    }
    inventoryTableBody.innerHTML = items
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
function updateResultsInfo(text) {
    resultsInfo.innerHTML = text;
}
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
// ============================
// CRUD Functions
// ============================
function addItem() {
    clearMessage();
    const data = getFormData();
    const errors = validateForm(data);
    if (errors.length > 0) {
        showMessage(errors.join("<br>"), "error");
        return;
    }
    if (isDuplicateItemId(data.itemId)) {
        showMessage("Item ID must be unique. This Item ID already exists.", "error");
        return;
    }
    if (findItemByName(data.itemName)) {
        showMessage("Item Name already exists. Please use a different Item Name.", "error");
        return;
    }
    const newItem = toInventoryItem(data);
    inventory.push(newItem);
    showMessage(`Item <strong>${newItem.itemName}</strong> added successfully.`, "success");
    clearForm();
    renderItems(inventory);
    updateResultsInfo(`Displaying ${inventory.length} item(s).`);
}
function loadItemForEdit() {
    clearMessage();
    const itemName = itemNameInput.value.trim();
    if (itemName === "") {
        showMessage("Enter the Item Name in the form first to load it for editing.", "error");
        return;
    }
    const item = findItemByName(itemName);
    if (!item) {
        showMessage(`No item found with name <strong>${itemName}</strong>.`, "error");
        return;
    }
    fillForm(item);
    showMessage(`Item <strong>${item.itemName}</strong> loaded into the form for editing.`, "info");
}
function updateItemByName() {
    clearMessage();
    const data = getFormData();
    const errors = validateForm(data, true);
    if (errors.length > 0) {
        showMessage(errors.join("<br>"), "error");
        return;
    }
    const targetIndex = findItemIndexByName(data.itemName);
    if (targetIndex === -1) {
        showMessage(`Cannot update. No item found with name <strong>${data.itemName}</strong>.`, "error");
        return;
    }
    const existingId = inventory[targetIndex].itemId;
    inventory[targetIndex] = toInventoryItem(data, existingId);
    showMessage(`Item <strong>${data.itemName}</strong> updated successfully.`, "success");
    renderItems(inventory);
    updateResultsInfo(`Displaying ${inventory.length} item(s).`);
}
let pendingDeleteName = "";
function requestDeleteItemByName() {
    clearMessage();
    const nameToDelete = itemNameInput.value.trim();
    if (nameToDelete === "") {
        showMessage("Enter the Item Name in the form to delete an item.", "error");
        return;
    }
    const item = findItemByName(nameToDelete);
    if (!item) {
        showMessage(`No item found with name <strong>${nameToDelete}</strong>.`, "error");
        return;
    }
    pendingDeleteName = item.itemName;
    confirmText.innerHTML = `Are you sure you want to delete <strong>${item.itemName}</strong>?`;
    confirmBox.classList.remove("hidden");
}
function confirmDelete() {
    const index = findItemIndexByName(pendingDeleteName);
    if (index === -1) {
        showMessage("Delete failed. Item could not be found.", "error");
        closeConfirmation();
        return;
    }
    const deletedItemName = inventory[index].itemName;
    inventory.splice(index, 1);
    showMessage(`Item <strong>${deletedItemName}</strong> deleted successfully.`, "success");
    closeConfirmation();
    clearForm();
    renderItems(inventory);
    updateResultsInfo(`Displaying ${inventory.length} item(s).`);
}
function closeConfirmation() {
    pendingDeleteName = "";
    confirmBox.classList.add("hidden");
    confirmText.innerHTML = "";
}
function searchByName() {
    clearMessage();
    const keyword = searchNameInput.value.trim();
    if (keyword === "") {
        showMessage("Please enter an Item Name to search.", "error");
        return;
    }
    const results = inventory.filter((item) => item.itemName.toLowerCase().includes(keyword.toLowerCase()));
    renderItems(results);
    updateResultsInfo(`Search results: ${results.length} item(s) found for "${keyword}".`);
    if (results.length === 0) {
        showMessage(`No items matched <strong>${keyword}</strong>.`, "info");
    }
    else {
        showMessage(`Search completed for <strong>${keyword}</strong>.`, "success");
    }
}
function showAllItems() {
    clearMessage();
    renderItems(inventory);
    updateResultsInfo(`Displaying all ${inventory.length} item(s).`);
}
function showPopularItems() {
    clearMessage();
    const popularItems = inventory.filter((item) => item.popularItem === "Yes");
    renderItems(popularItems);
    updateResultsInfo(`Displaying ${popularItems.length} popular item(s).`);
    if (popularItems.length === 0) {
        showMessage("There are no popular items in the database.", "info");
    }
}
// ============================
// Event Listeners
// ============================
addBtn.addEventListener("click", addItem);
editBtn.addEventListener("click", loadItemForEdit);
updateBtn.addEventListener("click", updateItemByName);
deleteBtn.addEventListener("click", requestDeleteItemByName);
clearBtn.addEventListener("click", () => {
    clearForm();
    clearMessage();
});
searchBtn.addEventListener("click", searchByName);
showAllBtn.addEventListener("click", showAllItems);
showPopularBtn.addEventListener("click", showPopularItems);
confirmYesBtn.addEventListener("click", confirmDelete);
confirmNoBtn.addEventListener("click", closeConfirmation);
// ============================
// Initial Render
// ============================
renderItems(inventory);
updateResultsInfo(`Displaying all ${inventory.length} item(s).`);
