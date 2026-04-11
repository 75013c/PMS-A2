// 24832452 HongyuLiu

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InventoryItem } from '../app.component';

// Inventory display component
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html'
})
export class InventoryComponent {
  // Controls whether the inventory section is currently visible
  @Input() currentSection = '';

  // Message content shown in the inventory section
  @Input() inventoryMessage = '';

  // Message type used to control inventory message styling
  @Input() inventoryMessageType = '';

  // Summary text shown above the inventory table
  @Input() inventoryResultsInfo = '';

  // Inventory items currently displayed in the table
  @Input() displayedInventoryItems: InventoryItem[] = [];

  // Event emitted when the user requests to show popular items
  @Output() showPopularItemsEvent = new EventEmitter<void>();

  // Event emitted when the user requests to show all items
  @Output() showAllItemsEvent = new EventEmitter<void>();

  // Return the badge class name based on stock status
  getBadgeClass(status: string): string {
    if (status === 'In Stock') {
      return 'badge-green';
    }

    if (status === 'Low Stock') {
      return 'badge-yellow';
    }

    return 'badge-red';
  }
}