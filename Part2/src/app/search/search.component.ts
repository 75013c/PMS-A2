// 24832452 HongyuLiu

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InventoryItem } from '../app.component';

// Search section component
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent {
  // Controls whether the search section is currently visible
  @Input() currentSection = '';

  // Message content shown in the search section
  @Input() searchMessage = '';

  // Message type used to control search message styling
  @Input() searchMessageType = '';

  // Current search keyword entered by the user
  @Input() searchKeyword = '';

  // Summary text shown above the search results table
  @Input() searchResultsInfo = '';

  // Search results currently displayed in the table
  @Input() searchResults: InventoryItem[] = [];

  // Event emitted when the search keyword changes
  @Output() searchKeywordChange = new EventEmitter<string>();

  // Event emitted when the user clears the search
  @Output() clearSearchEvent = new EventEmitter<void>();

  // Event emitted when the user starts a search
  @Output() searchItemEvent = new EventEmitter<void>();

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