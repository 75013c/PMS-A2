// ============================
// Type Definitions
// ============================

type Category = "Electronics" | "Furniture" | "Clothing" | "Tools" | "Miscellaneous";
type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";
type PopularItem = "Yes" | "No";

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

// ============================
// Inventory Data
// ============================

const inventory: InventoryItem[] = [
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

const itemIdInput = document.getElementById("itemId") as HTMLInputElement;
const itemNameInput = document.getElementById("itemName") as HTMLInputElement;
const categoryInput = document.getElementById("category") as HTMLSelectElement;
const quantityInput = document.getElementById("quantity") as HTMLInputElement;
const priceInput = document.getElementById("price") as HTMLInputElement;
const supplierNameInput = document.getElementById("supplierName") as HTMLInputElement;
const stockStatusInput = document.getElementById("stockStatus") as HTMLSelectElement;
const popularItemInput = document.getElementById("popularItem") as HTMLSelectElement;
const commentInput = document.getElementById("comment") as HTMLTextAreaElement;
const searchNameInput = document.getElementById("searchName") as HTMLInputElement;

const messageBox = document.getElementById("messageBox") as HTMLDivElement;
const inventoryTableBody = document.getElementById("inventoryTableBody") as HTMLTableSectionElement;
const resultsInfo = document.getElementById("resultsInfo") as HTMLDivElement;

const addBtn = document.getElementById("addBtn") as HTMLButtonElement;
const editBtn = document.getElementById("editBtn") as HTMLButtonElement;
const updateBtn = document.getElementById("updateBtn") as HTMLButtonElement;
const deleteBtn = document.getElementById("deleteBtn") as HTMLButtonElement;
const clearBtn = document.getElementById("clearBtn") as HTMLButtonElement;
const searchBtn = document.getElementById("searchBtn") as HTMLButtonElement;
const showAllBtn = document.getElementById("showAllBtn") as HTMLButtonElement;
const showPopularBtn = document.getElementById("showPopularBtn") as HTMLButtonElement;

const confirmBox = document.getElementById("confirmBox") as HTMLDivElement;
const confirmText = document.getElementById("confirmText") as HTMLDivElement;
const confirmYesBtn = document.getElementById("confirmYesBtn") as HTMLButtonElement;
const confirmNoBtn = document.getElementById("confirmNoBtn") as HTMLButtonElement;

// ============================
// Utility Functions
// ============================

function showMessage(message: string, type: "success" | "error" | "info"): void {
  messageBox.className = `message ${type}`;
  messageBox.innerHTML = message;
}

function clearMessage(): void {
  messageBox.className = "message";
  messageBox.innerHTML = "";
}

function normaliseName(name: string): string {
  return name.trim().toLowerCase();
}

function getFormData(): FormDataShape {
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

function validateForm(data: FormDataShape, isUpdate: boolean = false): string[] {
  const errors: string[] = [];

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
  } else if (Number.isNaN(Number(data.quantity)) || Number(data.quantity) < 0) {
    errors.push("Quantity must be a number greater than or equal to 0.");
  }

  if (data.price === "") {
    errors.push("Price is required.");
  } else if (Number.isNaN(Number(data.price)) || Number(data.price) < 0) {
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

function isDuplicateItemId(itemId: string): boolean {
  return inventory.some((item: InventoryItem): boolean => item.itemId === itemId);
}

function findItemByName(itemName: string): InventoryItem | undefined {
  return inventory.find(
    (item: InventoryItem): boolean => normaliseName(item.itemName) === normaliseName(itemName)
  );
}

function findItemIndexByName(itemName: string): number {
  return inventory.findIndex(
    (item: InventoryItem): boolean => normaliseName(item.itemName) === normaliseName(itemName)
  );
}

function getStockBadge(status: StockStatus): string {
  if (status === "In Stock") {
    return `<span class="badge badge-green">${status}</span>`;
  }
  if (status === "Low Stock") {
    return `<span class="badge badge-yellow">${status}</span>`;
  }
  return `<span class="badge badge-red">${status}</span>`;
}

function clearForm(): void {
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

function fillForm(item: InventoryItem): void {
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

function renderItems(items: InventoryItem[]): void {
  if (items.length === 0) {
    inventoryTableBody.innerHTML = `
      <tr>
        <td colspan="9">No items found.</td>
      </tr>
    `;
    return;
  }

  inventoryTableBody.innerHTML = items
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

function updateResultsInfo(text: string): void {
  resultsInfo.innerHTML = text;
}

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

// ============================
// CRUD Functions
// ============================

function addItem(): void {
  clearMessage();

  const data: FormDataShape = getFormData();
  const errors: string[] = validateForm(data);

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

  const newItem: InventoryItem = toInventoryItem(data);
  inventory.push(newItem);

  showMessage(`Item <strong>${newItem.itemName}</strong> added successfully.`, "success");
  clearForm();
  renderItems(inventory);
  updateResultsInfo(`Displaying ${inventory.length} item(s).`);
}

function loadItemForEdit(): void {
  clearMessage();

  const itemName: string = itemNameInput.value.trim();

  if (itemName === "") {
    showMessage("Enter the Item Name in the form first to load it for editing.", "error");
    return;
  }

  const item: InventoryItem | undefined = findItemByName(itemName);

  if (!item) {
    showMessage(`No item found with name <strong>${itemName}</strong>.`, "error");
    return;
  }

  fillForm(item);
  showMessage(`Item <strong>${item.itemName}</strong> loaded into the form for editing.`, "info");
}

function updateItemByName(): void {
  clearMessage();

  const data: FormDataShape = getFormData();
  const errors: string[] = validateForm(data, true);

  if (errors.length > 0) {
    showMessage(errors.join("<br>"), "error");
    return;
  }

  const targetIndex: number = findItemIndexByName(data.itemName);

  if (targetIndex === -1) {
    showMessage(`Cannot update. No item found with name <strong>${data.itemName}</strong>.`, "error");
    return;
  }

  const existingId: string = inventory[targetIndex].itemId;

  inventory[targetIndex] = toInventoryItem(data, existingId);

  showMessage(`Item <strong>${data.itemName}</strong> updated successfully.`, "success");
  renderItems(inventory);
  updateResultsInfo(`Displaying ${inventory.length} item(s).`);
}

let pendingDeleteName: string = "";

function requestDeleteItemByName(): void {
  clearMessage();

  const nameToDelete: string = itemNameInput.value.trim();

  if (nameToDelete === "") {
    showMessage("Enter the Item Name in the form to delete an item.", "error");
    return;
  }

  const item: InventoryItem | undefined = findItemByName(nameToDelete);

  if (!item) {
    showMessage(`No item found with name <strong>${nameToDelete}</strong>.`, "error");
    return;
  }

  pendingDeleteName = item.itemName;
  confirmText.innerHTML = `Are you sure you want to delete <strong>${item.itemName}</strong>?`;
  confirmBox.classList.remove("hidden");
}

function confirmDelete(): void {
  const index: number = findItemIndexByName(pendingDeleteName);

  if (index === -1) {
    showMessage("Delete failed. Item could not be found.", "error");
    closeConfirmation();
    return;
  }

  const deletedItemName: string = inventory[index].itemName;
  inventory.splice(index, 1);

  showMessage(`Item <strong>${deletedItemName}</strong> deleted successfully.`, "success");
  closeConfirmation();
  clearForm();
  renderItems(inventory);
  updateResultsInfo(`Displaying ${inventory.length} item(s).`);
}

function closeConfirmation(): void {
  pendingDeleteName = "";
  confirmBox.classList.add("hidden");
  confirmText.innerHTML = "";
}

function searchByName(): void {
  clearMessage();

  const keyword: string = searchNameInput.value.trim();

  if (keyword === "") {
    showMessage("Please enter an Item Name to search.", "error");
    return;
  }

  const results: InventoryItem[] = inventory.filter((item: InventoryItem): boolean =>
    item.itemName.toLowerCase().includes(keyword.toLowerCase())
  );

  renderItems(results);
  updateResultsInfo(`Search results: ${results.length} item(s) found for "${keyword}".`);

  if (results.length === 0) {
    showMessage(`No items matched <strong>${keyword}</strong>.`, "info");
  } else {
    showMessage(`Search completed for <strong>${keyword}</strong>.`, "success");
  }
}

function showAllItems(): void {
  clearMessage();
  renderItems(inventory);
  updateResultsInfo(`Displaying all ${inventory.length} item(s).`);
}

function showPopularItems(): void {
  clearMessage();

  const popularItems: InventoryItem[] = inventory.filter(
    (item: InventoryItem): boolean => item.popularItem === "Yes"
  );

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
clearBtn.addEventListener("click", (): void => {
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