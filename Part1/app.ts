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

const STORAGE_KEY = "inventory_session_data";

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
  }
];

function loadInventory(): InventoryItem[] {
  const saved: string | null = sessionStorage.getItem(STORAGE_KEY);

  if (saved) {
    return JSON.parse(saved) as InventoryItem[];
  }

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(defaultInventory));
  return [...defaultInventory];
}

let inventory: InventoryItem[] = loadInventory();
let currentEditingItemName: string = "";
let pendingDeleteName: string = "";

// ---------- Global helpers ----------
function saveData(): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
}

function normalise(name: string): string {
  return name.trim().toLowerCase();
}

function findItemByName(name: string): InventoryItem | undefined {
  return inventory.find((item: InventoryItem): boolean => normalise(item.itemName) === normalise(name));
}

function findIndexByName(name: string): number {
  return inventory.findIndex((item: InventoryItem): boolean => normalise(item.itemName) === normalise(name));
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

// ---------- Page detection ----------
const bodyElement = document.body as HTMLBodyElement;
const currentPage: string = bodyElement.dataset.page ?? "";

// ---------- Shared page elements ----------
const messageBox = document.getElementById("messageBox") as HTMLDivElement | null;
const resultsInfo = document.getElementById("resultsInfo") as HTMLDivElement | null;
const inventoryTableBody = document.getElementById("inventoryTableBody") as HTMLTableSectionElement | null;

function showMessage(message: string, type: "success" | "error" | "info"): void {
  if (!messageBox) {
    return;
  }

  messageBox.className = `message ${type}`;
  messageBox.innerHTML = message;
}

function clearMessage(): void {
  if (!messageBox) {
    return;
  }

  messageBox.className = "message";
  messageBox.innerHTML = "";
}

function updateResultsInfo(text: string): void {
  if (!resultsInfo) {
    return;
  }

  resultsInfo.innerHTML = text;
}

// ==================================================
// MANAGEMENT PAGE
// ==================================================
const addPanel = document.getElementById("addPanel") as HTMLDivElement | null;
const updatePanel = document.getElementById("updatePanel") as HTMLDivElement | null;
const deletePanel = document.getElementById("deletePanel") as HTMLDivElement | null;

const showAddPanelBtn = document.getElementById("showAddPanelBtn") as HTMLButtonElement | null;
const showUpdatePanelBtn = document.getElementById("showUpdatePanelBtn") as HTMLButtonElement | null;
const showDeletePanelBtn = document.getElementById("showDeletePanelBtn") as HTMLButtonElement | null;

// add inputs
const addItemIdInput = document.getElementById("addItemId") as HTMLInputElement | null;
const addItemNameInput = document.getElementById("addItemName") as HTMLInputElement | null;
const addCategoryInput = document.getElementById("addCategory") as HTMLSelectElement | null;
const addQuantityInput = document.getElementById("addQuantity") as HTMLInputElement | null;
const addPriceInput = document.getElementById("addPrice") as HTMLInputElement | null;
const addSupplierInput = document.getElementById("addSupplierName") as HTMLInputElement | null;
const addStockInput = document.getElementById("addStockStatus") as HTMLSelectElement | null;
const addPopularInput = document.getElementById("addPopularItem") as HTMLSelectElement | null;
const addCommentInput = document.getElementById("addComment") as HTMLTextAreaElement | null;

// update inputs
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

// delete input
const deleteItemNameInput = document.getElementById("deleteItemName") as HTMLInputElement | null;

// buttons
const addBtn = document.getElementById("addBtn") as HTMLButtonElement | null;
const editBtn = document.getElementById("editBtn") as HTMLButtonElement | null;
const updateBtn = document.getElementById("updateBtn") as HTMLButtonElement | null;
const deleteBtn = document.getElementById("deleteBtn") as HTMLButtonElement | null;

const clearAddBtn = document.getElementById("clearAddBtn") as HTMLButtonElement | null;
const clearUpdateBtn = document.getElementById("clearUpdateBtn") as HTMLButtonElement | null;
const clearDeleteBtn = document.getElementById("clearDeleteBtn") as HTMLButtonElement | null;

// confirmation
const confirmBox = document.getElementById("confirmBox") as HTMLDivElement | null;
const confirmText = document.getElementById("confirmText") as HTMLDivElement | null;
const confirmYesBtn = document.getElementById("confirmYesBtn") as HTMLButtonElement | null;
const confirmNoBtn = document.getElementById("confirmNoBtn") as HTMLButtonElement | null;

const formCard = document.getElementById("formCard") as HTMLElement | null;

function validateForm(data: FormDataShape, isUpdate: boolean = false): string[] {
  const errors: string[] = [];

  if (!isUpdate && data.itemId.trim() === "") {
    errors.push("Item ID is required.");
  }

  if (data.itemName.trim() === "") {
    errors.push("Item Name is required.");
  }

  if (data.category.trim() === "") {
    errors.push("Category is required.");
  }

  if (data.quantity.trim() === "") {
    errors.push("Quantity is required.");
  } else if (Number.isNaN(Number(data.quantity)) || Number(data.quantity) < 0) {
    errors.push("Quantity must be a number greater than or equal to 0.");
  }

  if (data.price.trim() === "") {
    errors.push("Price is required.");
  } else if (Number.isNaN(Number(data.price)) || Number(data.price) < 0) {
    errors.push("Price must be a number greater than or equal to 0.");
  }

  if (data.supplierName.trim() === "") {
    errors.push("Supplier Name is required.");
  }

  if (data.stockStatus.trim() === "") {
    errors.push("Stock Status is required.");
  }

  if (data.popularItem.trim() === "") {
    errors.push("Popular Item is required.");
  }

  return errors;
}

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

function clearDeleteForm(): void {
  if (deleteItemNameInput) {
    deleteItemNameInput.value = "";
  }
}

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

  clearMessage();
}

function addItem(): void {
  clearMessage();

  const data: FormDataShape = getAddFormData();
  const errors: string[] = validateForm(data);

  if (errors.length > 0) {
    showMessage(errors.join("<br>"), "error");
    return;
  }

  if (inventory.some((item: InventoryItem): boolean => item.itemId === data.itemId)) {
    showMessage("Item ID must be unique. This Item ID already exists.", "error");
    return;
  }

  if (findItemByName(data.itemName)) {
    showMessage("Item Name already exists. Please use a different Item Name.", "error");
    return;
  }

  inventory.push(toInventoryItem(data));
  saveData();
  clearAddForm();
  showMessage(`Item <strong>${data.itemName}</strong> added successfully.`, "success");
}

function loadItem(): void {
  clearMessage();

  const name: string = loadItemNameInput?.value.trim() ?? "";

  if (name === "") {
    showMessage("Enter the Item Name first to load it for editing.", "error");
    return;
  }

  const item: InventoryItem | undefined = findItemByName(name);

  if (!item) {
    showMessage("Item not found.", "error");
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

  showMessage(`Item <strong>${item.itemName}</strong> loaded for editing.`, "info");
}

function updateItem(): void {
  clearMessage();

  if (currentEditingItemName === "") {
    showMessage("Load item first.", "error");
    return;
  }

  const data: FormDataShape = getUpdateFormData();
  const errors: string[] = validateForm(data, true);

  if (errors.length > 0) {
    showMessage(errors.join("<br>"), "error");
    return;
  }

  const index: number = findIndexByName(currentEditingItemName);

  if (index === -1) {
    showMessage("Original item could not be found.", "error");
    return;
  }

  const duplicateNameIndex: number = inventory.findIndex(
    (item: InventoryItem): boolean =>
      normalise(item.itemName) === normalise(data.itemName) &&
      normalise(item.itemName) !== normalise(currentEditingItemName)
  );

  if (duplicateNameIndex !== -1) {
    showMessage("Another item already uses this Item Name.", "error");
    return;
  }

  const existingId: string = inventory[index].itemId;
  inventory[index] = toInventoryItem(data, existingId);
  currentEditingItemName = inventory[index].itemName;
  saveData();

  showMessage(`Item <strong>${inventory[index].itemName}</strong> updated successfully.`, "success");
}

function requestDelete(): void {
  clearMessage();

  const name: string = deleteItemNameInput?.value.trim() ?? "";

  if (name === "") {
    showMessage("Enter the Item Name to delete an item.", "error");
    return;
  }

  const item: InventoryItem | undefined = findItemByName(name);

  if (!item) {
    showMessage("Item not found.", "error");
    return;
  }

  pendingDeleteName = item.itemName;

  if (confirmText && confirmBox) {
    confirmText.innerHTML = `Are you sure you want to delete <strong>${item.itemName}</strong>?`;
    confirmBox.classList.remove("hidden");
  }
}

function confirmDelete(): void {
  const index: number = findIndexByName(pendingDeleteName);

  if (index === -1) {
    showMessage("Delete failed. Item could not be found.", "error");
    closeConfirmation();
    return;
  }

  const deletedName: string = inventory[index].itemName;
  inventory.splice(index, 1);
  saveData();
  clearDeleteForm();
  closeConfirmation();
  showMessage(`Item <strong>${deletedName}</strong> deleted successfully.`, "success");
}

function closeConfirmation(): void {
  pendingDeleteName = "";

  if (confirmBox) {
    confirmBox.classList.add("hidden");
  }

  if (confirmText) {
    confirmText.innerHTML = "";
  }
}

function initializeManagementPage(): void {
  showAddPanelBtn?.addEventListener("click", (): void => setPanel("add"));
  showUpdatePanelBtn?.addEventListener("click", (): void => setPanel("update"));
  showDeletePanelBtn?.addEventListener("click", (): void => setPanel("delete"));

  addBtn?.addEventListener("click", addItem);
  editBtn?.addEventListener("click", loadItem);
  updateBtn?.addEventListener("click", updateItem);
  deleteBtn?.addEventListener("click", requestDelete);

  clearAddBtn?.addEventListener("click", (): void => {
    clearAddForm();
    clearMessage();
  });

  clearUpdateBtn?.addEventListener("click", (): void => {
    clearUpdateForm();
    clearMessage();
  });

  clearDeleteBtn?.addEventListener("click", (): void => {
    clearDeleteForm();
    clearMessage();
  });

  confirmYesBtn?.addEventListener("click", confirmDelete);
  confirmNoBtn?.addEventListener("click", closeConfirmation);

  clearMessage();
}

// ==================================================
// SEARCH PAGE
// ==================================================
const searchNameInput = document.getElementById("searchName") as HTMLInputElement | null;
const searchBtn = document.getElementById("searchBtn") as HTMLButtonElement | null;
const clearSearchBtn = document.getElementById("clearSearchBtn") as HTMLButtonElement | null;

function searchItem(): void {
  clearMessage();

  const keyword: string = searchNameInput?.value.trim() ?? "";

  if (keyword === "") {
    showMessage("Please enter an Item Name to search.", "error");
    return;
  }

  const results: InventoryItem[] = inventory.filter((item: InventoryItem): boolean =>
    item.itemName.toLowerCase().includes(keyword.toLowerCase())
  );

  renderItems(results, inventoryTableBody);
  updateResultsInfo(`Search results: ${results.length} item(s) found for "${keyword}".`);

  if (results.length === 0) {
    showMessage(`No items matched <strong>${keyword}</strong>.`, "info");
  } else {
    showMessage(`Search completed for <strong>${keyword}</strong>.`, "success");
  }
}

function clearSearch(): void {
  if (searchNameInput) {
    searchNameInput.value = "";
  }

  clearMessage();
  renderItems([], inventoryTableBody);
  updateResultsInfo("No search performed yet.");
}

function initializeSearchPage(): void {
  searchBtn?.addEventListener("click", searchItem);
  clearSearchBtn?.addEventListener("click", clearSearch);

  renderItems([], inventoryTableBody);
  updateResultsInfo("No search performed yet.");
}

// ==================================================
// INVENTORY PAGE
// ==================================================
const showAllBtn = document.getElementById("showAllBtn") as HTMLButtonElement | null;
const showPopularBtn = document.getElementById("showPopularBtn") as HTMLButtonElement | null;

function showAllItems(): void {
  clearMessage();
  renderItems(inventory, inventoryTableBody);
  updateResultsInfo(`Displaying all ${inventory.length} item(s).`);
}

function showPopularItems(): void {
  clearMessage();

  const popularItems: InventoryItem[] = inventory.filter(
    (item: InventoryItem): boolean => item.popularItem === "Yes"
  );

  renderItems(popularItems, inventoryTableBody);
  updateResultsInfo(`Displaying ${popularItems.length} popular item(s).`);

  if (popularItems.length === 0) {
    showMessage("There are no popular items in the database.", "info");
  }
}

function initializeInventoryPage(): void {
  showAllBtn?.addEventListener("click", showAllItems);
  showPopularBtn?.addEventListener("click", showPopularItems);

  showAllItems();
}

// ==================================================
// APP START
// ==================================================
if (currentPage === "management") {
  initializeManagementPage();
} else if (currentPage === "search") {
  initializeSearchPage();
} else if (currentPage === "inventory") {
  initializeInventoryPage();
}