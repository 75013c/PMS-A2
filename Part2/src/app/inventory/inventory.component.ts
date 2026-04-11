import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InventoryItem } from '../app.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html'
})
export class InventoryComponent {
  @Input() currentSection = '';
  @Input() inventoryMessage = '';
  @Input() inventoryMessageType = '';
  @Input() inventoryResultsInfo = '';
  @Input() displayedInventoryItems: InventoryItem[] = [];

  @Output() showPopularItemsEvent = new EventEmitter<void>();
  @Output() showAllItemsEvent = new EventEmitter<void>();

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